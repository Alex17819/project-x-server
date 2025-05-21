import { ConflictException, Injectable } from "@nestjs/common";
import { UploadFileDto } from "./dto/upload-file.dto";
import * as path from "node:path";
import * as fs from "node:fs/promises";

const uploadFolderFilePath = path.resolve(__dirname, "..", "..", "uploads");

const createUploadFolder = async () => {
  try {
    await fs.access(uploadFolderFilePath);
  } catch (error) {
    await fs.mkdir(uploadFolderFilePath, { recursive: true });
  }
};

@Injectable()
export class FilesService {
  async uploadFile({ filename, base64 }: UploadFileDto) {
    await createUploadFolder();

    const filePath = path.join(uploadFolderFilePath, filename);
    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      throw new ConflictException(
        "Fișierul cu acest nume de fișier există deja",
      );
    }

    await fs.writeFile(filePath, base64, "base64");

    return { message: "Fișier încărcat cu succes", filePath };
  }

  async getFileLinks() {
    await createUploadFolder();

    const res = await fs.readdir(uploadFolderFilePath);
    return res.map((filename) => ({
      link: `http://localhost:8888/uploads/${filename}`,
    }));
  }
}
