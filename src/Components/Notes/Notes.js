import React, { useState,useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "@material-ui/core/Button";
import LinkIcon from "@material-ui/icons/Link";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
function Notes() {
  const [note, setNote] = useState("");

  async function fetchData(){
      const result = await axios({
          method:"get",
          "url":"http://localhost:8080/notes"
      })
      if(result.data.statusCode === 200){
          console.log(result.data.payload)
      }
  }

  useEffect(()=>{

  },[])
  return (
    <div
      style={{
        width: "100vw",
        height: "auto",
        position: "absolute",
        top: "20vh",
      }}
    >
      <Grid container justify="space-evenly">
        <Grid item sm={3} md={3}  >
          <Card style={{marginTop:"3.2rem",height:"60vh"}}>
            <CardContent style={{padding:"1rem"}}>
                <h3>All your notes</h3>
                <br />
                <hr />
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={7} md={7}>
          <>
            <Button
              style={{ marginBottom: "1rem" }}
              aria-haspopup="true"
              variant="contained"
              color="primary"
            >
              Save &nbsp;
            </Button>
            <Button
              style={{ marginBottom: "1rem", float: "right" }}
              aria-haspopup="true"
              variant="contained"
              color="secondary"
            >
              <LinkIcon style={{ height: "20px", width: "20px" }} />
              &nbsp; Link to Opportunity
            </Button>
            <CKEditor
              editor={ClassicEditor}
              data={"<h1> Hi There! <br />Start editing..... </h1>"}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNote(data);
              }}
            />
          </>
        </Grid>
      </Grid>
    </div>
  );
}

export default Notes;
