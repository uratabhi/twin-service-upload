import TwinProtocol from "twin-protocol-dev";
import FormData from "form-data";
import { Readable } from "stream";
import "dotenv/config";

export class TwinService {
  constructor() {
    this.validateEnvironmentVariables();

    this.twinProtocol = new TwinProtocol({
      accessKey: process.env.TP_ACCESS_KEY,
      secretKey: process.env.TP_SECRET_KEY,
      clientId: process.env.TP_CLIENT_ID,
    });
  }

  validateEnvironmentVariables() {
    const requiredEnvVars = ["TP_ACCESS_KEY", "TP_SECRET_KEY", "TP_CLIENT_ID"];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  }

  async uploadMediaFile(req) {
    try {
      const formData = new FormData();

      const vaultId = req.body.vaultId;

      formData.append("vaultId", vaultId);

      const files = req.files;

      const fileNames = [];
      files.forEach((file, index) => {
        const fileStream = this.bufferToStream(file.buffer);
        formData.append("files", fileStream, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
        fileNames.push(file.originalname);
      });

      let pAnalysis = req.body.analysis || {};
      console.log("pAnalysis", pAnalysis);
      const analysis = {
        [fileNames[0]]: pAnalysis,
      };
      formData.append("analysis", JSON.stringify(analysis));

      const sdkResponse = await this.twinProtocol.saveMedia(formData);
      console.log("response from sdk", sdkResponse);
      return sdkResponse;
    } catch (error) {
      console.error("Detailed error uploading media file:", error);
      throw error;
    }
  }

  bufferToStream(buffer) {
    const stream = new Readable();
    stream._read = () => {};
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
