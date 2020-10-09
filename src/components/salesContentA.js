import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


export default function multipleAutocomplete(data) {


  return (
    <div >
      <Autocomplete
        multiple
        id="tags-standard"
        options={data.state.developLanguages}
        getOptionLabel={(option) => option.name ? option.name : ""}
        //defaultValue={[top100Films[13]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Multiple values"
            placeholder="Favorites"
          />
        )}
      />


    </div>
  );
}
