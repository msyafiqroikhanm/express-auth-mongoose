const fs = require('fs');
const path = require('path');
const multer = require('multer');
const slug = require('slugify');

let target;
let folder;
let dirPath;

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const splitFieldname = (fieldname) => {
  const capitalLetterIndex = fieldname.search(/[A-Z]/);
  if (capitalLetterIndex !== -1) {
    const targetName = fieldname.slice(0, capitalLetterIndex).toLowerCase();
    const folderName = capitalizeFirstLetter(fieldname.slice(capitalLetterIndex));
    return { targetName, folderName };
  }
  return null; // Handle the case when capital letter is not found
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (fs.existsSync('public')) {
      cb(null, 'public');
    } else {
      fs.mkdirSync('public');
      cb(null, 'public');
    }
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    [target] = file.fieldname.split('Image');
    if (target === 'Image' || !target) {
      target = null;
    }

    if (target) {
      dirPath = path.join(__dirname, `../public/images/${target}s`);
    } else {
      dirPath = path.join(__dirname, '../public/images');
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    if (target) {
      if (target === 'committee') {
        const slugedName = slug(req.body.name, {
          replacement: '-',
          lower: true,
          strict: true,
        });
        const slugedPhoneNbr = slug(req.body.phoneNbr, {
          replacement: '',
          lower: true,
          strict: true,
        });
        cb(null, `${target}-${slugedName}-${slugedPhoneNbr}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
      } else {
        cb(null, `${target}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
      }
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
  },
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    [target] = file.fieldname.split('Document');
    if (target === 'Document' || !target) {
      target = null;
    }

    if (target) {
      dirPath = path.join(__dirname, `../public/documents/${target}s`);
    } else {
      dirPath = path.join(__dirname, '../public/documents');
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    if (target) {
      cb(null, `${target}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    [target] = file.fieldname.split('Video');
    if (target === 'Video' || !target) {
      target = null;
    }

    if (target) {
      dirPath = path.join(__dirname, `../public/videos/${target}s`);
    } else {
      dirPath = path.join(__dirname, '../public/videos');
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    if (target) {
      cb(null, `${target}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
  },
});

const combineStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldname = splitFieldname(file.fieldname);
    target = fieldname.targetName.toLowerCase();

    const ext = path.extname(file.originalname);
    if (['.jpeg', '.png', '.jpg'].includes(ext)) {
      folder = 'image';
    } else if (['.mp4', '.3gp'].includes(ext)) {
      folder = 'video';
    } else if (['.pdf', '.docx', '.xlsx', '.csv'].includes(ext)) {
      folder = 'document';
    }

    if (target) {
      dirPath = path.join(__dirname, `../public/${folder}s/${target}s`);
    } else {
      dirPath = path.join(__dirname, '../public/');
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    if (target) {
      cb(null, `${target}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
  },
});

const participantStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldname = splitFieldname(file.fieldname);
    target = fieldname.targetName.toLowerCase();

    if (file.fieldname === 'participantImage') {
      const ext = path.extname(file.originalname);
      if (['.jpeg', '.png', '.jpg'].includes(ext)) {
        folder = 'image';
      } else if (['.mp4', '.3gp'].includes(ext)) {
        folder = 'video';
      } else if (['.pdf', '.docx', '.xlsx', '.csv'].includes(ext)) {
        folder = 'document';
      }

      if (target) {
        dirPath = path.join(__dirname, `../public/${folder}s/${target}s`);
      } else {
        dirPath = path.join(__dirname, '../public/');
      }
    } else {
      const ext = path.extname(file.originalname);
      if (['.jpeg', '.png', '.jpg'].includes(ext)) {
        folder = 'image';
      } else if (['.pdf', '.docx'].includes(ext)) {
        folder = 'document';
      }

      if (target) {
        dirPath = path.join(__dirname, `../private/${folder}s/${target}s`);
      } else {
        dirPath = path.join(__dirname, '../private/');
      }
    }
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    if (target) {
      const slugedName = slug(req.body.name, {
        replacement: '-',
        lower: true,
        strict: true,
      });
      const slugedPhoneNbr = slug(req.body.phoneNbr, {
        replacement: '',
        lower: true,
        strict: true,
      });
      cb(null, `${target}-${slugedName}-${slugedPhoneNbr}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    } else {
      const slugedName = slug(req.body.name, {
        replacement: '-',
        lower: true,
        strict: true,
      });
      const slugedPhoneNbr = slug(req.body.phoneNbr, {
        replacement: '',
        lower: true,
        strict: true,
      });
      cb(null, `${slugedName}-${slugedPhoneNbr}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
  },
});

const memoryStorage = multer.memoryStorage();

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 100000000 },
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 100000000 },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100000000 },
});

const uploadCombine = multer({
  storage: combineStorage,
  limits: { fileSize: 500000000 },
});

const uploadParticipant = multer({
  storage: participantStorage,
  limits: { fieldSize: 50000000 },
});

const uploadWithMemory = multer({ memoryStorage });

module.exports = {
  storage,
  uploadImage,
  uploadDocument,
  uploadVideo,
  uploadCombine,
  uploadWithMemory,
  uploadParticipant,
};
