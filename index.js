const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For potential API calls (unspecified in original code)
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for logging requests (similar to Slack Bolt's `log_request`)
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  next();
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Body parser middleware for handling request bodies
app.use(bodyParser.json());

// Endpoint to handle the `/lead` command (similar to Slack Bolt's `handle_command`)
app.post('/lead', async (req, res) => {
  try {
    const triggerId = req.body.trigger_id;

    // Replace with your actual API call and data structure (if applicable)
    const view = {
      "type": "modal",
      "callback_id": "gratitude-modal",
      "title": {"type": "plain_text", "text": "Lead Created Form"},
      "submit": {"type": "plain_text", "text": "Submit"},
      "close": {"type": "plain_text", "text": "Cancel"},
      "blocks": [
        {
            "type": "input",
            "block_id": "first_name",
            "element": {"type": "plain_text_input", "action_id": "first_name"},
            "label": {"type": "plain_text", "text": "First Name"},
        },
        {
            "type": "input",
            "block_id": "last_name",
            "element": {"type": "plain_text_input", "action_id": "last_name"},
            "label": {"type": "plain_text", "text": "Last Name"},
        },
        {
            "type": "input",
            "block_id": "company",
            "element": {"type": "plain_text_input", "action_id": "company"},
            "label": {"type": "plain_text", "text": "Company"},
        },
        {
            "type": "input",
            "block_id": "city",
            "element": {"type": "plain_text_input", "action_id": "city"},
            "label": {"type": "plain_text", "text": "City"},
        },
        {
            "type": "input",
            "block_id": "phone",
            "element": {"type": "plain_text_input", "action_id": "phone"},
            "label": {"type": "plain_text", "text": "Phone"},
        },
        {
            "type": "input",
            "block_id": "email",
            "element": {"type": "plain_text_input", "action_id": "email"},
            "label": {"type": "plain_text", "text": "Email"},
        },
        {
            "type": "input",
            "block_id": "status",
            "element": {"type": "plain_text_input", "action_id": "status"},
            "label": {"type": "plain_text", "text": "Status"},
        },
      ],
    };

    const response = await axios.post('https://slack.com/api/views.open', {
        triggerId,
      view,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    });

    console.log(response.data); // Log the response for debugging

    res.status(200).send(); // Acknowledge the request
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to handle modal submission (similar to Slack Bolt's `view_submission`)
app.post('/view_submission', async (req, res) => {
  try {
    const view = req.body.view;
    const leadInfo = {
      FirstName: view.state.values.first_name.first_name.value,
      LastName: view.state.values.last_name.last_name.value,
      Company: view.state.values.company.company.value,
      City: view.state.values.city.city.value,
      Phone: view.state.values.phone.phone.value,
      Email: view.state.values.email.email.value,
      Status: view.state.values.status.status.value,
    };

    // Process the lead information here (e.g., store it in a database, send it to a CRM)
    console.log('Lead information:', leadInfo);

    res.status(200).send(); // Acknowledge the submission
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/' , (req,res)=>{
    res.text('Hellow up and running! ');
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
