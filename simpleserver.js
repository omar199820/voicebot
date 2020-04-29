const bodyParser = require('body-parser');
const express = require('express');
const { Carousel , BasicCard  ,dialogflow ,SimpleResponse  } = require('actions-on-google');
const { WebhookClient , Payload ,  Card ,  Suggestion , Image } = require('dialogflow-fulfillment');
const app = express();
const app1 = dialogflow({debug: true});
const mysql = require('mysql');
const gender = require('gender-detection');

const intentSuggestions = [
 'Basic Card'
];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('online'));
app.post('/dialogflow', express.json(), (req, res) => {
 const agent = new WebhookClient({ request: req, response: res });

 function welcome () {
 agent.add("welcome");
 agent.add("salem");
agent.add(new Card({
       title: 'men collection ',
       imageUrl: 'https://image.shutterstock.com/image-vector/men-fashion-logo-design-template-260nw-507663607.jpg',
       text: 'you can see our men product form here \n   💁',
       buttonText: 'visit the men collection',
       buttonUrl: 'http://localhost/prestashop/4-men'
     })
   );

 }
 function connectToDatabase(){
 
   const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "prestashop"
   });

   return new Promise((resolve,reject) => {
      connection.connect();
      resolve(connection);
   });
   
 }
 
 function queryDatabase(connection){
   return new Promise((resolve, reject) => {
     connection.query('SELECT * from ps_customer', (error, results, fields) => {
       resolve(results);
     });
   });

 }
 

 function handleEmail(agent){
   
   
   const user_email = agent.parameters.name;

   return connectToDatabase()
   .then(connection => {
     return queryDatabase(connection)
     .then(result => {
       console.log(result);
       let g;

       
         result.map(ps_customer => {
         if(user_email === ps_customer.firstname){
           
       
                 
           agent.add(`First Name: ${ps_customer.firstname} and Last Name: ${ps_customer.lastname}`);
           g = gender.detect(ps_customer.lastname);
          if (g === "male"){
            handleMaleCollection(agent);

          }
          if (g==="female"){
            handleFemaleCollection(agent);
          }
         }
       
       });
             
       connection.end();
     });
   });

 }

 function handleMaleCollection(agent){
 agent.add("here is the men collection");
       
   agent.add(new Card({
       title: 'men collection ',
       imageUrl: 'https://image.shutterstock.com/image-vector/men-fashion-logo-design-template-260nw-507663607.jpg',
       text: 'you can see our men product form here \n   💁',
       buttonText: 'visit the men collection',
       buttonUrl: 'http://localhost/prestashop/4-men'
     })
   );

 }

 function handleFemaleCollection(agent){
  agent.add("here is the women collection");
        
    agent.add(new Card({
        title: 'women collection ',
        imageUrl: 'data:image/jpeg;base64,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',
        text: 'you can see our women product form here \n   💁',
        buttonText: 'visit the women collection',
        buttonUrl: 'http://localhost/prestashop/5-women'
      })
    );


 }

 function handlePanier(agent){
   agent.add("you can view your card");
        agent.add(new Card({
        title: 'card  ',
        text: 'you can see your card\n   💁',
        buttonText: 'visit your  card',
        buttonUrl: 'http://localhost/prestashop/fr/panier?action=show'
      })
    );
  

 }


  let intentMap = new Map();
 intentMap.set('Default Welcome Intent', welcome);
 intentMap.set("Email", handleEmail);
 intentMap.set("MaleProduct",handleMaleCollection);
 intentMap.set("FemaleProduct",handleFemaleCollection);
 intentMap.set("Panier",handlePanier);
 agent.handleRequest(intentMap);
});

app.listen(process.env.PORT || 8080);