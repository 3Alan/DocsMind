# Chat-Markdown

Chat-Markdown is an open-source project that allows you to chat with your markdown files.

## Demo

[Demo Site](https://chat-markdown.alanwang.site/)

## Features

- 🤖 Chat with your markdown files
- 🖍️ Highlight source
- 📤 Upload files
- 💾 Data saved locally
- 💰 Token usage tracker

## Future Development

I plan to add the following features in the future:

- [ ] Support for more file formats: pdf, txt
- [ ] Summarize
- [ ] Download text from the internet
- [ ] Markdown-formatted message
- [ ] Stream returns
- [ ] i18n
- [ ] Desktop application

## License

Chat-Markdown is licensed under the MIT License.

## How to run

### Create .env

Create .env file and fill in environment variables, see .env.example for reference

### Frontend

#### Install dependencies

```
yarn
```

```
yarn dev
```

### Run Backend

you need a python environment

#### Create virtual environment

```
cd api-src
python -m venv .venv
```

#### Active virtual environment

windows

```
.venv\Scripts\activate
```

mac

```
. .venv/bin/activate
```

#### Install dependencies

```
pip install -r requirements.txt
```

#### Run Services

```
flask run --reload
```
