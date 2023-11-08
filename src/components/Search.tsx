import { Fade, Grow, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, Popper, Skeleton, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHits, useSearchBox } from 'react-instantsearch';

export default function Search() {
  const memoizedSearch = useCallback((query: any, search: (arg0: string) => void) => {
    search(query);
  }, []);
  const { refine } = useSearchBox({
    queryHook: memoizedSearch,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const searchHandler = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        if (document.activeElement != inputRef.current) {
          inputRef.current!.focus();
        } else {
          inputRef.current!.blur();
        }
      }
    };
    document.addEventListener("keydown", searchHandler);
    return () => {
      document.removeEventListener("keydown", searchHandler);
    };
  }, []);
  const [isopen, setopen] = useState(false)
  const [has_text, set_has_text] = useState(false)

  return <>
    <TextField
      type="search"
      id="search"
      label="Search"
      size='small'
      onFocus={() => setopen(true)}
      onBlur={() => setopen(false)}
      onChange={e => {
        set_has_text(!!e.target.value);
        refine(e.target.value);
      }}
      inputRef={inputRef}
      InputProps={{
        endAdornment: <InputAdornment position="end">⌘K</InputAdornment>,
      }}
    />
    {/* always open so fade away works */}
    <Popper open={true} anchorEl={inputRef.current} placement='bottom-end'>
      <Grow timeout={200} in={isopen}>
        <Paper>
          {has_text && <SearchResults />}
        </Paper>
      </Grow>
    </Popper>
  </>
}


function SearchResults() {
  const { hits } = useHits()

  if (hits.length) {
    return <List>
      {hits.map(fu)}
    </List>
  } else {
    <Typography>No results</Typography>
  }

  function fu(input: any) {
    const {project, displayName, brief} = input
    return <ListItem key={project} disableGutters disablePadding dense>
      <ListItemButton href={`/pkgs/${project}/`} dense>
        <ListItemText primary={displayName} secondary={brief} />
      </ListItemButton>
    </ListItem>
  }
}