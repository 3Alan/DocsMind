# DocsMind

DocsMind is an open-source project that allows you to chat with your docs.

![Stack](https://skillicons.dev/icons?i=vite,react,ts,tailwind,flask)

It is currently under development and there may be major changes at any time.

## 🎬 Demo

[Demo Site](https://docs-mind.alanwang.site/)

> **Warning**
>
> Due to the free plan of Railway only providing 500 hours per month, the Demo on the 21st day of each month will not be available. Please clone it locally for use at that time.

## 🌟 Features

- 🤖 Ask a question with your docs
- 📝 Summarize docs
- 🖍️ Highlight source
- 📤 Upload docs .pdf,.md(best support)
- 💾 Data saved locally
- 💰 Token usage tracker
- 🐳 Dockerize

## 🚀 Road Map

- [ ] Chat mode
- [ ] Dark mode
- [ ] / command (/fetch /summarize)
- [ ] Reduce the size of the server image.
- [ ] Support for more docs formats: txt...
- [ ] Download docs from the internet
- [ ] Markdown-formatted message
- [ ] i18n
- [ ] Desktop application

If you find this project helpful, please consider giving it a star 🌟

## 💻 Environment Variables

| Name                 | Description                            | Optional |
| -------------------- | -------------------------------------- | -------- |
| OPENAI_PROXY         | will replace https://api.openai.com/v1 | ✅       |
| VITE_SERVICES_URL    | backend url for frontend code          | ✅       |
| VITE_DISABLED_UPLOAD | DISABLED_UPLOAD                        | ✅       |

## ❓ FAQ

This project includes both frontend (/client) and backend (/server) code. The frontend code is used to display the UI, while the backend code provides services to the UI.

### How to deploy?

[More details](https://github.com/3Alan/DocsMind/blob/main/Deployment.md)

### How to run?

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

### Local Development

<details>
  <summary>Detail</summary>

#### Create .env

Create a `.env` file and copy the contents of `.env.example` to modify it.

#### Run Frontend UI

1. Install dependencies

```
yarn
```

2. Run app

```
yarn dev
```

#### Run Backend Services

you need a python environment

1. Create virtual environment

```
cd server
python -m venv .venv
```

2. Active virtual environment

windows

```
.venv\Scripts\activate
```

mac

```
. .venv/bin/activate
```

3. Install dependencies

```
pip install -r requirements.txt
```

4. Run Services

```
flask run --reload --port=8080
```

</details>

## 📝 License

[AGPL-3.0 License](https://github.com/3Alan/DocsMind/blob/main/LICENSE)

## ☕ Buy me a coffee

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N1L5Y7V)

<details>
  <summary>Alipay and Wechat</summary>
  <img height="300" src="https://raw.githubusercontent.com/3Alan/images/master/img/%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BA%8C%E5%90%88%E4%B8%80%E6%94%B6%E6%AC%BE%E7%A0%81.jpg" />
</details>
