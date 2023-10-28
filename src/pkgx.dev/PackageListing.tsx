import { Box, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { S3Client, ListObjectsV2Command, _Object } from "@aws-sdk/client-s3";
import { Link, useParams } from 'react-router-dom';
import { useAsync } from "react-use"
import Footer from '../components/Footer';
import Masthead from '../components/Masthead';

function dirname(path: string | undefined) {
  path ??= ''
  path = path.trim().replace(/\/+$/, '');
  const ii = path.lastIndexOf('/');
  return ii >= 0 ? path.slice(ii + 1) : path;
}

export default function PackageListing() {
  return <Stack direction="column" maxWidth='md' p={2} minHeight='100vh' mx='auto' spacing={4}>
    <Masthead />
    <PackageListingMeat />
    <Footer/>
  </Stack>
}

function PackageListingMeat() {
  const [dirs, setdirs] = useState<string[]>([])
  const [ispkg, set_is_pkg] = useState(false)
  const { "*": splat } = useParams();

  useEffect(() => {
    const client = new S3Client({
      region: 'us-east-1',
      signer: { sign: async (request) => request }  // is a public bucket but the SDK barfs without this
    });
    const command = new ListObjectsV2Command({
      Bucket: "dist.tea.xyz", // required
      Delimiter: `/`,
      Prefix: splat
    });
    client.send(command).then(data => {
      setdirs(data.CommonPrefixes?.filter(({Prefix}) => {
        console.log(dirname(Prefix))
        switch (dirname(Prefix)) {
        case 'darwin':
        case 'linux':
        case 'windows':
          set_is_pkg(true);
          // fall through
        case '':
        case undefined:
          return false
        default:
          return true
        }
      }).map(x => x.Prefix!) ?? [])
    }).catch(console.error) //TODO error

    document.title = `pkgx — ${splat || 'pkgs'}`

    return () => {}
  }, [splat])

  return <Stack spacing={3}>
    {ispkg
      ? <Package project={splat!.slice(0, -1)} dirs={dirs} />
      : <Listing dirs={dirs} />
    }
  </Stack>
}

function Listing({ dirs }: { dirs: string[] }) {
  return <ul>
    {dirs.map(obj => <li>
      <Link key={obj} to={`/pkgs/${obj}`}>{obj}</Link>
    </li>)}
  </ul>
}

function Package({ project, dirs }: { project: string, dirs: string[] }) {
  return <Stack direction='row' spacing={4}>
    <img src={`https://gui.tea.xyz/prod/${project}/1024x1024.webp`} width={375} height={375} />
    <Box>
      <h1>{project}</h1>
      <Stack direction={'row'} spacing={2}>
        <Button href={`tea://packages/${project}`}>Open in OSS.app</Button>
        <Button href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`}>View package.yml</Button>
      </Stack>

      <h2>Versions</h2>
      <Versions project={project} />

      {dirs.length > 0 && <>
        <h2>Subprojects</h2>
        <Listing dirs={dirs} />
      </> }
    </Box>
  </Stack>
}

function Versions({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(`https://dist.pkgx.dev/${project}/darwin/aarch64/versions.txt`);
    if (!rsp.ok) rsp = await fetch(`https://dist.pkgx.dev/${project}/linux/x86-64/versions.txt`);
    const txt = await rsp.text()
    return txt.split("\n")
  }, [project]);

  if (state.loading) {
    return <p>Loading…</p>
  } else if (state.error) {
    return <>
      <h2>Error</h2>
      <p>{state.error.message}</p>
    </>
  } else {
    return <ul>
      {state.value!.map(version => <li key={version}>{version}</li>)}
    </ul>
  }
}