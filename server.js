const net = require('net')
const c = require('ansi-colors')

const server = net.createServer((socket) => {
    const id = Math.floor(Math.random() * 8999999999) + 1000000000
    const prompt = `${c.magentaBright(id)} ${c.greenBright('$')}`

    console.log('Connected: ' + id)
    console.log(socket.remoteAddress)

    socket.write('\x1bc')
    socket.write(`
${c.greenBright('---')} Welcome to the interactive netcat game.
${c.greenBright('---')} Your IP address is ${socket.remoteAddress}.

    - Type ${c.black(c.bgCyan('HELP'))} for a guide.
    - Type ${c.black(c.bgCyan('QUIT'))} to exit at any time.
    - Leave your CAPS LOCK on, it's fun!`.trim() + `\n\n${prompt} `)

    const temp_data = {}
    const save_data = {}

    socket.on('data', (_data) => {
        const data = _data.toString()
        const command = data.split(' ')[0].toUpperCase().trim()

        let is_ended = false
        let matched = false
        const end = () => { is_ended = true; socket.end() }
        const is = (cmd, fn) => { if (command.toLowerCase() === cmd.toLowerCase()) { matched = true; fn() } }
        const send = (x) => socket.write(x.trim())

        if(temp_data.waiting_for_load) {
            
        }

        is('help', _ => {
            send('Work in progress!')
        })

        is('load', _ => {
            send('Now, input your JSON save file and submit it.')
            temp_data.waiting_for_load = true
        })

        is('quit', _ => {
            send('See you later!')
            end()
        })

        is('meow', _ => {
            if(temp_data.catted) {
                switch(temp_data.catted) {
                    case 1:
                        send('Meow to you too.')
                        break
                    case 2:
                        send('Quite a noisy cat, huh?')
                        break
                    case 3:
                        send('Well, to be honest, I didn\'t expect you to know how to do anything else. You\'re a cat.')
                        break
                    case 4:
                    default:
                        send('You should at least try to play the game, don\'t you think?')
                }

                temp_data.catted++
                if(temp_data.catted > 4) temp_data.catted = 4
            } else {
                send('Hello there! Didn\'t know cats could play this game.')
                temp_data.catted = 1
            }
        })

        is('clear', _ => {
            send('\x1bc')
        })

        if (!is_ended) {
            if(!matched) {
                socket.write(`${c.redBright('[Error]')} Not found: ${command}`)
            }

            socket.write(`\n${prompt} `)
        }
    })

    socket.on('end', () => {
        console.log('Client disconnected.')
    })
})

const port = '80'
const host = '0.0.0.0'

server.listen(port, host, () => {
    console.log(`Game server running at tcp://${host}:${port}`)
})