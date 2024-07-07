import { Box, Button, Stack, Typography, Link, Alert, Skeleton, Card, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { S3Client, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/CallMade';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isArray, isPlainObject, isString } from 'is-what';
import Terminal from '../components/Terminal';
import get_pkg_name from '../utils/pkg-name';
import { useAsync } from 'react-use';
import { get } from '../utils/api';
import * as yaml from 'yaml';

function dirname(path: string | undefined) {
  path ??= ''
  path = path.trim().replace(/\/+$/, '');
  const ii = path.lastIndexOf('/');
  return ii >= 0 ? path.slice(ii + 1) : path;
}

// Dumb because the interface was thoughtlessly constructed
interface DumbPackage {
  description: string
  short_description: string
  homepage?: string
  github: string
}

export default function PackageListing() {
  const { "*": splat } = useParams();
  const project = splat?.slice(0, -1)

  const {loading, value, error} = useAsync(async () => {
    const client = new S3Client({
      region: 'us-east-1',
      signer: { sign: async (request) => request }  // is a public bucket but the SDK barfs without this
    });
    const command = new ListObjectsV2Command({
      Bucket: "dist.tea.xyz", // required
      Delimiter: `/`,
      Prefix: splat
    });
    const data = await client.send(command)

    let ispkg = false

    const dirs = data.CommonPrefixes?.filter(({Prefix}) => {
      switch (dirname(Prefix)) {
      case 'darwin':
      case 'linux':
      case 'windows':
        ispkg = true;
        // fall through
      case '':
      case undefined:
        return false
      default:
        return true
      }
    }).map(x => x.Prefix!) ?? []

    document.title = `${project || 'pkgs'} — pkgx`

    return {dirs, ispkg}

  }, [splat])

  if (loading) {
    return <Skeleton animation="wave" />
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>
  } else {
    const {dirs, ispkg} = value!
    return <Stack spacing={3}>
      {ispkg
        ? <Package project={project!} dirs={dirs} />
        : <Listing dirs={dirs} />
      }
    </Stack>
  }
}

function Listing({ dirs }: { dirs: string[] }) {
  return <ul>
    {dirs.map(obj => <li key={obj}>
      <Link component={RouterLink} to={`/pkgs/${obj}`}>{obj}</Link>
    </li>)}
  </ul>
}

function Package({ project, dirs }: { project: string, dirs: string[] }) {
  const { loading, error, value } = useAsync(async () => {
    const url = `https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/package.yml`
    const rsp = await fetch(url)
    const txt = await rsp.text()
    const yml = yaml.parse(txt)
    return yml
  }, [project])

  const description = useAsync(async () => {
    const dumb_mangle = project.replaceAll("/", ":")  // see dumb rationale above
    return await get<DumbPackage>(`packages/${dumb_mangle}`)
  }, [project])

  const buttons = description.value && <>
    {description.value.homepage &&
      <Button variant='outlined' href={description.value.homepage} target='_blank' rel='noreferrer' endIcon={<ArrowOutwardIcon />}>Homepage</Button>
    }
    <Button variant='outlined' href={description.value.github} target='_blank' rel='noreferrer' endIcon={<ArrowOutwardIcon />}>GitHub</Button>
  </>

  return <Stack direction={{xs: "column", md: "row"}} spacing={4}>
    <Card sx={{height: 'fit-content', minWidth: 375}}>
      <img style={{display: 'block'}} src={undefined} width={375} height={375} />
    </Card>
    <Stack spacing={2}>
      <Box>
        <Typography mb={1} variant='h2'>{get_pkg_name(project)}</Typography>
        {/* {description_body()} */}
        <README project={project} />
        <Stack useFlexGap direction='row' spacing={2} mt={3}>
          <Button variant='contained' href={`tea://packages/${project}`}>Open in OSS.app</Button>
          <Button variant='outlined' target='_blank' rel='noreferrer' href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`} endIcon={<ArrowOutwardIcon />}>View package.yml</Button>
          {buttons}
        </Stack>
      </Box>

      <Terminal>
        {codeblock()}
      </Terminal>

      <Box>
        {metadata()}
      </Box>

      <Box>
        <Typography variant='h5'>Versions</Typography>
        <Versions project={project} />
      </Box>

      {dirs.length > 0 && <Box>
        <Typography variant='h5'>Subprojects</Typography>
        <Listing dirs={dirs} />
      </Box> }
    </Stack>
  </Stack>

  function codeblock() {
    if (loading || error || !value?.entrypoint) {
      return `sh <(curl https://pkgx.sh) +${project} sh`
    } else {
      return `sh <(curl https://pkgx.sh) mash pkgxdev/run ${project}`
    }
  }

  function description_body() {
    return
    // if (description.loading) {
    //   return <Skeleton animation="wave" />
    // } else if (description.error) {
    //   return <Alert severity="error">{description.error.message}</Alert>
    // } else {
    //   return <Box>
    //     <Typography variant='h5'>{description.value!.short_description}</Typography>
    //     <Typography variant='body2' mt={1} mb={3} color='text.secondary'>{description.value!.description}</Typography>
    //   </Box>
    // }
  }

  function metadata() {
    if (loading) {
      return <Skeleton animation="wave" />
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>
    } else {
      return <Stack spacing={2}>
        <Box>
          <Typography variant='h5'>Programs</Typography>
          {programs()}
        </Box>
        <Box>
          <Typography variant='h5'>Companions</Typography>
          {companions()}
        </Box>
        <Box>
          <Typography variant='h5'>Dependencies</Typography>
          {deps()}
        </Box>
      </Stack>

      function programs() {
        const provides: string[] = get_provides(value)
        if (!isArray(provides)) {
          return <Alert severity="error">Unexpected error</Alert>
        } else if (provides.length) {
          return <ul>
            {provides.map((program, i) => <li key={i}>
              <code>{program.replace(/^s?bin\//g, '')}</code>
            </li>)}
          </ul>
        } else {
          return <Typography>none</Typography>
        }
      }
      function companions() {
        const companions: Record<string, string> = value?.companions ?? {}
        if (!isPlainObject(companions)) {
          return <Alert severity="error">Unexpected error</Alert>
        } else {
          const entries = Object.entries(companions)
          if (entries.length) {
            return <ul>
              {entries.map(([companion]) => <li key={companion}>
                <Link component={RouterLink} to={`/pkgs/${companion}/`}>{companion}</Link>
              </li>)}
            </ul>
          } else {
            return <Typography>none</Typography>
          }
        }
      }
      function deps() {
        const deps: Record<string, string> = value?.dependencies ?? {}
        if (!isPlainObject(deps)) {
          return <Alert severity="error">Unexpected error</Alert>
        } else {
          return entries(deps)
        }

        function entries(deps: Record<string, string>) {
          const entries = Object.entries(deps)
          if (entries.length) {
            return <ul>
              {entries.map(entry)}
            </ul>
          } else {
            return <Typography>none</Typography>
          }
        }

        function entry([name, version]: [name: string, version: string | Record<string, string>]) {
          if (isPlainObject(version)) {
            return <li key={name}>
              {name}
              {entries(version)}
            </li>
          } else {
            return <li key={name}>
              <Link component={RouterLink} to={`/pkgs/${name}/`}>{name}{pretty(version)}</Link>
            </li>
          }
        }

        function pretty(version: string) {
          if (version == '*') {
            return ''
          } else if (/^\d/.test(version)) {
            return `@${version}`
          } else {
            return version
          }
        }
      }
    }
  }
}

import Markdown from '../components/Markdown';

function README({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(`https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/README.md`);
    if (rsp.ok) {
      return await rsp.text()
    }
  }, [project]);

  if (state.loading) {
    return <Skeleton animation="wave" />
  } else if (state.error) {
    return <Alert severity="error">{state.error.message}</Alert>
  } else if (state.value) {
    return <Markdown txt={state.value} />
  } else {
    return null
  }
}

function Versions({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(`https://dist.pkgx.dev/${project}/darwin/aarch64/versions.txt`);
    if (!rsp.ok) rsp = await fetch(`https://dist.pkgx.dev/${project}/linux/x86-64/versions.txt`);
    const txt = await rsp.text();
    const versions = txt.split("\n");
    return versions.sort().reverse();
  }, [project]);

  if (state.loading) {
    return <>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </>
  } else if (state.error) {
    return <>
      <Alert severity="error">{state.error.message}</Alert>
    </>
  } else {
    return <>
      <ul>
        {state.value!.map(version => <li key={version}>{version}</li>)}
      </ul>
      <Typography variant="subtitle2" color='textSecondary'>
        If you need a version we don’t have <Link href={`https://github.com/pkgxdev/pantry/issues/new?title=version+request:+${project}`}>
            request it here
          </Link>.
      </Typography>
      <Typography variant="subtitle2" color='textSecondary'>
        View package listing in <Link href={`https://dist.pkgx.dev/?prefix=${project}`}>1999 Mode</Link>
      </Typography>
    </>
  }
}

function get_provides(yml: any): string[] {
  let provides = yml['provides']
  if (isString(provides)) {
    return [provides]
  }
  if (isPlainObject(provides)) {
    const { darwin, linux, windows, '*': star } = provides
    provides = []
    const set = new Set()
    for (const x of [darwin, linux, windows, star].flatMap(x => x)) {
      if (!set.has(x) && x) {
        provides.push(x)
        set.add(x)
      }
    }
  }
  return provides ?? []
}
