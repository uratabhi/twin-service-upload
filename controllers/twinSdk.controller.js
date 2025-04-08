import { TwinService } from "../services/twinSdk.service.js";

const twinService = new TwinService();

export const uploadData = async (req, res) => {
  try {
    const { vaultId, analysis } = req.body;
    const files = req.files;

    if (!vaultId) {
      return res.status(400).json({
        message: "Vault ID is required",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "At least one file is required",
      });
    }

    if (!analysis) {
      return res.status(400).json({
        message: "Analysis is required",
      });
    }

    const sdkResponse = await twinService.uploadMediaFile(req);

    res.status(200).json({
      message: "Upload successful",
      response: sdkResponse,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message || "Unknown error",
    });
  }
};

export const twinVideoResponse = async (req, res, next) => {
  const { input, twinId } = req.body;
  try {
    const result = await twinService.twinVideoResponse(input, twinId);
    res.status(200).json({
      success: true,
      message: "twin video response received succesfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "error getting video response",
      error: error.message || "Unknonw error",
    });
  }
};
