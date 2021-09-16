import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { omit } from "lodash";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import AnnounceIcon from "assets/images/announce-icon.png";
import SpeakerImg from "assets/images/speaker.png";
import Container from "components/Container";
import Indicator from "components/Indicator";
import TopAds from "components/TopAds";
import Paper from "components/Paper";
import { SUBMIT_CONTACT_FORM } from "queries/forms";

const Promote = () => {
  const [data, setData] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitContactForm, { loading: submitting }] = useMutation(
    SUBMIT_CONTACT_FORM,
    {
      variables: {
        ...omit(data, "agree"),
      },
      onCompleted: () => {
        setData({});
        setSuccess(true);
      },
    }
  );
  const updateHandler =
    (field, targetField = "value") =>
    ({ target }) => {
      setData({ ...data, [field]: target[targetField] });
    };
  const disabled =
    !data.customerName || !data.email || !data.description || !data.agree;
  return (
    <Container className="promote">
      <TopAds />
      <Grid container className="promote-container">
        <Grid item xs={12} className="wrapper">
          <Typography variant="h5" className="title">
            Promote
          </Typography>
          <Indicator />
          <Typography className="description">
            Are you looking to <b>promote</b> your project to a wider community?
            The Wen Lambo Charting Dapp reaches a wide and ever expanding
            audience and will add huge growth potential to your project. Wen
            Lambo is a trusted name in the crypto community, and our reputation
            can only aid in reinforcing the credibility of your project.
          </Typography>
          <div className="instruction-wrapper">
            <Paper color="dark" className="adverts-placed">
              <Typography className="adverts-description">
                <b>Adverts placed</b> on our site will be seen by countless
                people daily as they make use of our unique tracking and
                charting tools to monitor your projects. Wen Lambo is dedicated
                to promoting and helping small start up tokens with real
                potential in the marketplace. Our Dapp is designed with small
                tokens in mind, and our advertising reflects this.
                <br />
                <br />
                So, if you are looking to expand your reach and promote your
                project on a trusted Dapp, you have come to the right place.
                Fill in your details on the contact form below and we will be in
                touch.
              </Typography>
            </Paper>
            <img src={SpeakerImg} className="speaker-img" />
          </div>

          <Paper color="dark" className="criteria">
            <div className="announce-wrapper">
              <img src={AnnounceIcon} className="icon" />
              <Typography>
                All projects must meet the below criteria to be considered for
                advertising
              </Typography>
            </div>
            <div className="criteria-wrapper">
              <Typography>
                · Must be verified on BSC Scan
                <br />
                · Must have a website
                <br />· Must have LP locked for a minimum of 6 months
              </Typography>
              <Typography className="disclaimer">
                Please do not apply if your project does not meet these
                requirements. Legitimate projects only.
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
      {success && (
        <Paper color="dark" className={`contact-form`}>
          <Typography variant="h6" className="title">
            Thank you for the submission. We will come back to you very soon.
          </Typography>
          <Button
            className="submit-another"
            variant="contained"
            onClick={() => setSuccess(false)}
          >
            Submit another
          </Button>
        </Paper>
      )}
      {!success && (
        <Paper
          color="dark"
          className={`contact-form ${submitting ? "loading" : ""}`}
        >
          <Typography variant="h6" className="title">
            Promote
          </Typography>
          <Indicator loading={submitting} />
          <TextField
            placeholder="Name"
            variant="outlined"
            className="text-field"
            onChange={updateHandler("customerName")}
            value={data.customerName || ""}
            fullWidth
          ></TextField>
          <TextField
            placeholder="Email"
            className="text-field"
            variant="outlined"
            onChange={updateHandler("email")}
            value={data.email || ""}
            fullWidth
          ></TextField>
          <TextField
            placeholder="Describe your project"
            className="text-field"
            variant="outlined"
            multiline
            rows={5}
            onChange={updateHandler("description")}
            value={data.description || ""}
            fullWidth
          ></TextField>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="default"
                onChange={updateHandler("agree", "checked")}
                checked={data.agree || false}
              />
            }
            label="I agree that my project meets the requirements to be considered for advertising."
          />
          <Button
            disabled={disabled}
            className="submit-contact-us"
            variant="contained"
            onClick={() => submitContactForm()}
          >
            Submit
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Promote;
