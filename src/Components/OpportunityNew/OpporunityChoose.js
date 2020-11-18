import React,{useState} from 'react'
import {Chip,Grid} from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done';
function OpporunityChoose(props) {

    const [clicked, setClicked] = useState(true);
    return (
        <Grid item md={4} style={{padding:"1rem",textOverflow:"none"}}>
        <Chip
        style={{fontSize:"0.6rem",width:"100%",textAlign:"center"}}
        label={props.name}
        color={clicked ? "primary" : "default"}
        onClick={()=>{
            setClicked(!clicked);
            props.handleChoose(props.name);
        }}
      />
      </Grid>
    )
}

export default OpporunityChoose
