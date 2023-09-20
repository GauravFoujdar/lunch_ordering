const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleware);
server.use(jsonServer.bodyParser);

/**
 * User Data
 */

const userData = require('../server/data/users');

server.get('/api/users', (_req, res, _next) => {
    res.status(200).send(userData.users);
});

server.post('/api/login', (req, res, next) => { 
  const user = userData.users.data.users.filter(
    u => u.userName === req.body.userName && u.password === req.body.password
  )[0];

  if (user) {
    res.send({ ...user, password: undefined });
  } else {
    res.status(401).send('Incorrect username or password');
  }
});

/**
 * Menu Data
 */
const menuData = require('../server/data/menu');

server.get('/api/menu', (req, res, _next) => {
    const date = req.query.date;
    const menu = menuData.menus.data.menus.filter(m => m.date === date)[0];
    res.send({ ...menu });
});

server.post('/api/menu', (req, res, _next) => {
    const newMenu = req.body.menu;
    newMenu.items.forEach(item => {
        item.id = createGuid();
    });
    menuData.menus.data.menus.push(newMenu);
    res.status(200).send({...newMenu});
});

/**
 * Orders
 */
const ordersData = require('../server/data/orders');

server.get('/api/orders', (req, res, _next) => {
    const date = req.query.date;
    const orders = ordersData.orders.data.orders.filter(o => o.date === date);
    res.status(200).send(orders);
})

server.post('/api/orders', (req, res, _next) => {
  const order = req.body.order;
  order.id = createGuid();
    ordersData.orders.data.orders.push(order);
    res.status(200).send({...order});
})

server.put('/api/orders', (req, res, _next) => {
  const order = req.body.order; 

  const orders = ordersData.orders.data.orders.filter(o => o?.id !== order.id);
  ordersData.orders.data.orders = orders;

  ordersData.orders.data.orders.push(order);
  res.status(200).send({...order});
})

server.listen(3000, () => {
    console.log('JSON server listening on port 3000');
});

function createGuid(){  
   function S4() {  
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
   }  
   return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
}  