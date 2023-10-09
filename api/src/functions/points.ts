import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as csv from 'csv-parser'
import * as fs from 'fs'

const results = []

fs.createReadStream('../public/data.csv')
    .pipe(csv())
    .on('data', (data) => {
        try {
            if (Number(data?._8)) {
                results.push({ longitude: data._9, latitude: data._8, lap: data._2 })
            }
        } catch (err) {

        }
    })
    .on('end', () => {
        //console.log(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
    });

export async function points(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const out = results.filter(v => {
        const lap = request.query.get('lap')
        if (v.lap === lap) {
            return true
        }
    })
    return { jsonBody: { points: out } };
};

app.http('points', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: points
});
