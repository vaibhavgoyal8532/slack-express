const { App, ExpressReceiver } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
const slackWebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

boltApp.command('/lead', async ({ ack, body, client }) => {
  ack();

  try {
    const res = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'gratitude-modal',
        title: { type: 'plain_text', text: 'Lead Created Form' },
        submit: { type: 'plain_text', text: 'Submit' },
        close: { type: 'plain_text', text: 'Cancel' },
        blocks: [
          { type: 'input', block_id: 'first_name', element: { type: 'plain_text_input', action_id: 'first_name' }, label: { type: 'plain_text', text: 'First Name' } },
          { type: 'input', block_id: 'last_name', element: { type: 'plain_text_input', action_id: 'last_name' }, label: { type: 'plain_text', text: 'Last Name' } },
          { type: 'input', block_id: 'company', element: { type: 'plain_text_input', action_id: 'company' }, label: { type: 'plain_text', text: 'Company' } },
          { type: 'input', block_id: 'city', element: { type: 'plain_text_input', action_id: 'city' }, label: { type: 'plain_text', text: 'City' } },
          { type: 'input', block_id: 'phone', element: { type: 'plain_text_input', action_id: 'phone' }, label: { type: 'plain_text', text: 'Phone' } },
          { type: 'input', block_id: 'email', element: { type: 'plain_text_input', action_id: 'email' }, label: { type: 'plain_text', text: 'Email' } },
          { type: 'input', block_id: 'status', element: { type: 'plain_text_input', action_id: 'status' }, label: { type: 'plain_text', text: 'Status' } },
        ],
      },
    });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
});

app.post('/slack/events', async (req, res) => {
  const { body } = req;

  try {
    if (body.type === 'view_submission' && body.view.callback_id === 'gratitude-modal') {
      console.log(body.view.state.values);
      const leadInfo = {
        FirstName: body.view.state.values.first_name.first_name.value,
        LastName: body.view.state.values.last_name.last_name.value,
        Company: body.view.state.values.company.company.value,
        City: body.view.state.values.city.city.value,
        Phone: body.view.state.values.phone.phone.value,
        Email: body.view.state.values.email.email.value,
        Status: body.view.state.values.status.status.value,
      };

      console.log(leadInfo);
    }
  } catch (error) {
    console.error(error);
  }

  res.status(200).send();
});

(async () => {
  await boltApp.start(3000);
  console.log('⚡️ Bolt app is running!');
})();
