import doc from '../lib/google.js';

export default async function updateDatabase(prompt, signature) {
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  return sheet.addRow({
    Timestamp: (new Date()).toString(),
    Response: prompt,
    Signature: signature,
  }).catch((err) => console.log(err));
}
