import React from 'react';
import Grid from '@material-ui/core/Grid';
import './CardDisplay.scss';
import ScenarioCard from '../ScenarioCard';

const s1 = '"I am trying to spend less time in the room with this COVID+ patient, but she needs my attention to adjust drips, give intermittent meds, and give reassurance. I’m wearing full PPE, but I’m worried…"';
const s2 = '"I saw people on TV wearing much more and different PPE than my hospital has chosen. I’m scared my team is making poor choices!"';
const s3 = '"I just got yelled at by a supervisor who thought I wasn’t moving fast enough in an emergency. But I had to make sure my PPE was on and complete."';

function CardDisplay() {
  return (
    <Grid
      container
      className="CardDisplay"
      direction="row"
      justify="space-evenly"
      alignItems="center"
    >
      <ScenarioCard scenario={s1} signature="Michael, Boston" response="You got this. You’re doing the right thing. Patients need their nurses." />
      <ScenarioCard scenario={s2} signature="John, New York" response="I was scared too, but I asked a member of our COVID leadership team to explain the differences, and it made sense." />
      <ScenarioCard scenario={s3} signature="Sarah, Texas" response="You have to be safe in order to stay health and kind. You’re doing the right thing." />
    </Grid>
  );
}

export default CardDisplay;  