

let express = require('express')

let app = express();
let http = require('http');
let server = http.createServer(app);




let socketIO = require('socket.io');



// let io = socketIO(server);


// new changes
var io = socketIO.listen( server )

//

clients =[]

const port = process.env.PORT || 3000;


app.get('/', function(req, res){
    res.send(`socket working ${port}`)
})

io.on('connection', (socket)=>{

    socket.on('join', function(data){

        socket.join(data.room);
        console.log(data.user + ' Joined the room ' + data.room)
        
        socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message: 'has joined the room.'})
    });

    socket.on('leave', function(data){

        console.log(data.user + ' left the room ' + data.room)
        socket.broadcast.to(data.room).emit('left room', {user: data.user, message: 'has left the room.'})
        socket.leave(data.room);


    });

    socket.on('message', function(data){
        console.log(data)
        io.in(data.room).emit('new message', {user: data.user, message: data.message} )
    })








    socket.on('storeClientInfo', function(data){
        var ClientInfo = new Object();
        ClientInfo.customId = data.custId;
        ClientInfo.clientId = socket.id;
        clients.push(ClientInfo)
        console.log(clients)

    })
    
    console.log(socket.id)


    socket.on('new-message', (message)=>{
        console.log( message)


        // sending to the sender using socket
        // sending to all the connected devices using io

        socket.emit('new-message', message)
    })

    socket.on('broadcast', (message)=>{
        console.log(message)
        io.emit('broadcast', message)
    } )

    socket.on('disconnect', ()=>{
        console.log(socket.id, "disconnect" )

        io.emit('broadcast', `${socket.id} disconnected`)

        console.log("disconnected")
        clients = clients.filter( function(client){
            return client.clientId != socket.id
        })
        console.log(clients)

    })
})


server.listen(port, ()=>{
    console.log(`started on port ${port}`);
})