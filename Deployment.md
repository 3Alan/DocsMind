The first thing you need to know is that this project includes frontend (UI) and backend. I strongly recommend using Docker for deployment.

If you just want to try it out instead of using it in a production environment, you can deploy it using Vercel + Railway.

## Docker

Fork the repository and clone the code to your local machine.

> **Warning**
>
> Please check if you can access OpenAI in your region, you can refer to the [issue](https://github.com/3Alan/DocsMind/issues/3#issuecomment-1511470063) for more information.

1. Create .env

Create a `.env` file and copy the contents of `.env.example` to modify it.

2. Run App

```bash
docker-compose up -d
```

Please add `--build` to rebuild the image after each code update.

```bash
docker-compose up -d --build
```

now you can access the app at `http://localhost:8081`

All data will be saved in the `./data` directory.

## Vercel + Railway

> **Warning**
>
> ❗❗❗ if you want to use this project in a production environment, do not deploy it in this way. All data will be cleared when you redeploy.

We will deploy the code separately to Vercel and Railway.

Please follow the steps one by one.

### Railway

Deploy the backend using the following template.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/HcW7kc?referralCode=Hk0oZ6)

Do not check Private repository.
![20230511150842](https://raw.githubusercontent.com/3Alan/images/master/img/20230511150842.png)

After deployment, you will receive a domain. Copy it as it will be used later.
![20230511135709](https://raw.githubusercontent.com/3Alan/images/master/img/20230511135709.png)

You can also customize the domain.
![20230511140533](https://raw.githubusercontent.com/3Alan/images/master/img/20230511140533.png)

### Vercel

1. Select the repository created by Railway.
2. Change the Root Directory to "client".
3. Change the Framework Preset to "Vite".
4. Add an environment variable `VITE_SERVICES_URL` with the value of Railway's Domain.

![20230511141639](https://raw.githubusercontent.com/3Alan/images/master/img/20230511141639.png)

![20230511141851](https://raw.githubusercontent.com/3Alan/images/master/img/20230511141851.png)

Now you can upload your files, ❗❗❗ but please be reminded that all data will be cleared once you redeploy.

**If you have a better deployment method, please feel free to share the tutorial and submit a pull request.**
