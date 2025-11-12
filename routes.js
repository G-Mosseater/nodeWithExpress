// import { writeFile } from 'fs/promises';

// export function requestHandler(req, res) {
//     const url = req.url    
//     const method = req.method

//     if (url === '/') {
//         res.write('<html>')
//         res.write('<form action="/message" method="POST">');
//         res.write('  <input name="msg" placeholder="say something">');
//         res.write('  <button type="submit">Send</button>');
//         res.write('</form>');

//         res.write('</html>')
//         return res.end()
//     }

//     if (url === '/message' && method === 'POST') {
//         const body = []
//         req.on('data', (chunk) => {
//             console.log(chunk)
//             body.push(chunk)
//         })
//         return req.on('end', async () => {
//             const parsedBody = Buffer.concat(body).toString()
//             const message = parsedBody.split('=')[1]

//             try {
//                 await writeFile('message.txt', message)

//             }
//             catch (err) {
//                 console.error('Error writing file', err)
//             }

//             res.statusCode = 302
//             res.setHeader('Location', '/')
//             return res.end()
//         })

//     }
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<html>')
//     res.write('<head>  <title>First page  </title>    </head> ')
//     res.write('<body> <h1> HI!!!!! </h1>  </body>')

//     res.write('</html>')
//     res.end()
// }
