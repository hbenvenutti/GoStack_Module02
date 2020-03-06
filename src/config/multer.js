import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// extname -> extensão de um arquivo;
// arquivo de configuração de onde vai ser salva a imagem (tmp/uploads)
// a função callback (cb) retorna o erro ou um hex + o tipo do arquivo;
// exemplo: hgjfdjugh.png

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
