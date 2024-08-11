# React basic

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [React](https://reactjs.org/) apps in minutes. Use this repo with the [React quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=react) to build and customize a new static site.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

TO get running locally where it doesnt automatically update webpage as changes are made:
1. Run "git clone https://github.com/tarunaidoo/Infrastructure_Management"
2. Run "cd Infrastructure_Management"
3. create your own branch and enter it
4. Run "npm run build" to generate build
5. Run "swa start ./build --data-api-location ./swa-db-connections" this will allow you to run the application locally
Changes will not be automatically reflcted

TO get running locally where it DOES automatically update webpage as changes are made:
1. Run "git clone https://github.com/tarunaidoo/Infrastructure_Management"
2. Run "cd Infrastructure_Management"
3. create your own branch and enter it
4. Run "npm start"
5. In a seperate terminal inside of the Infrastructure_Management folder run "swa start http://localhost:3000 --data-api-location ./swa-db-connections"
Now changes made will be automatically reflected




