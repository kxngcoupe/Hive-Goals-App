/**
 * @fileoverview This file is the entrypoint for all of your Genkit flows.
 *
 * This file is where you should define your Genkit flows. It is used to
 * generate the OpenAPI specification for your flows, which is used to
 * create the Cloud Functions that will run your flows.
 */

import * as ff from 'firebase-functions';
import * as admin from 'firebase-admin';
import {runFlow, getFlows} from 'genkit/firebase';
import './ai/flows/goal-improvement-suggestions.js';
import './ai/flows/motivational-message-flow.js';
import './ai/flows/reward-suggestion.js';

admin.initializeApp();

const flowNames = Object.keys(getFlows());
for (const name of flowNames) {
  exports[name] = ff.https.onCall(async (data, context) => {
    return runFlow(name, data, {
      auth: context.auth,
    });
  });
}
