// https://tauri.app/v1/guides/building/sidecar/
import fs from 'fs';
import { execa } from 'execa';
import path from 'path';

// TODO: 开始时需要清空文件夹

async function main() {
  const rustInfo = (await execa('rustc', ['-vV'])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
  if (!targetTriple) {
    console.error('Failed to determine platform target triple');
  }

  fs.readdir('src-tauri/binaries', (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach(file => {
      const extension = path.extname(file);
      const fileName = path.basename(file, extension);
      fs.renameSync(
        `src-tauri/binaries/${fileName}${extension}`,
        `src-tauri/binaries/${fileName}-${targetTriple}${extension}`
      );

      console.log(`rename ${file} to ${fileName}-${targetTriple}${extension}`);
    });
  });
}

main().catch(e => {
  throw e;
});
