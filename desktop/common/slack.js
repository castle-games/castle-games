// TODO(jim): This is bad but we can tolerate this for now.
const url = `https://hooks.slack.com/services/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`;

export const sendMessage = message => {
  fetch(url, { method: 'POST', body: JSON.stringify({ text: message }) });
};
