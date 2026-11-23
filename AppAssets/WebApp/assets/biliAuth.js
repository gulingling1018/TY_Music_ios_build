import { f as apiRequest } from "./index.js";
import { Q as QRCode } from "./vendor.js";
class BiliAuthService {
  /**
   * 获取扫码登录二维码
   */
  async getQRCode() {
    const response = await apiRequest("/api/auth/bilibili/qrcode");
    if (response.ok) {
      const result = await response.json();
      const data = result.data || result;
      return data.data || data;
    }
    throw new Error("获取二维码失败");
  }
  /**
   * 轮询扫码状态
   */
  async pollStatus(qrcodeKey) {
    const response = await apiRequest("/api/auth/bilibili/poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ qrcode_key: qrcodeKey })
    });
    if (response.ok) {
      const result = await response.json();
      const data = result.data || result;
      return data.data || data;
    }
    throw new Error("轮询失败");
  }
  /**
   * 打开扫码授权窗口
   */
  openAuthWindow() {
    return new Promise(async (resolve, reject) => {
      try {
        const qrCodeData = await this.getQRCode();
        const qrImageSrc = await this.createQRCodeImageDataUrl(qrCodeData.url);
        const isAndroid = typeof window.Android !== "undefined";
        let scanWindow = null;
        let checkClosed = null;
        let qrDialog = null;
        const handleCancel = () => {
          clearInterval(pollInterval);
          if (checkClosed) clearInterval(checkClosed);
          if (scanWindow) scanWindow.close();
          if (qrDialog) qrDialog.remove();
          reject(new Error("授权已取消"));
        };
        if (isAndroid) {
          console.log("Android 环境：创建二维码对话框");
          qrDialog = this.createAndroidQRDialog(qrImageSrc, handleCancel);
        } else {
          scanWindow = this.createScanWindow(qrImageSrc);
          if (!scanWindow) {
            reject(new Error("无法打开扫码窗口，请允许弹出窗口"));
            return;
          }
          checkClosed = setInterval(() => {
            if (scanWindow.closed) {
              clearInterval(checkClosed);
              clearInterval(pollInterval);
              if (qrDialog) qrDialog.remove();
              reject(new Error("授权已取消"));
            }
          }, 500);
        }
        const pollInterval = setInterval(async () => {
          try {
            const result = await this.pollStatus(qrCodeData.qrcode_key);
            if (result.status === "success") {
              clearInterval(pollInterval);
              if (checkClosed) clearInterval(checkClosed);
              if (scanWindow) {
                scanWindow.close();
              }
              if (qrDialog) {
                qrDialog.remove();
              }
              console.log("✅ 扫码授权成功:", result.user);
              resolve(result.user || { message: result.message || "登录成功" });
            } else if (result.status === "expired") {
              clearInterval(pollInterval);
              if (checkClosed) clearInterval(checkClosed);
              if (scanWindow) {
                scanWindow.close();
              }
              if (qrDialog) {
                qrDialog.remove();
              }
              reject(new Error("二维码已过期，请重试"));
            } else if (result.status === "error") {
              clearInterval(pollInterval);
              if (checkClosed) clearInterval(checkClosed);
              if (scanWindow) {
                scanWindow.close();
              }
              if (qrDialog) {
                qrDialog.remove();
              }
              reject(new Error(result.message || "扫码失败"));
            }
          } catch (error) {
            clearInterval(pollInterval);
            if (checkClosed) clearInterval(checkClosed);
            if (scanWindow) {
              scanWindow.close();
            }
            if (qrDialog) {
              qrDialog.remove();
            }
            reject(error);
          }
        }, 2e3);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * 本地生成二维码，避免把登录 URL 发送给第三方二维码服务。
   */
  async createQRCodeImageDataUrl(text) {
    if (!text) throw new Error("二维码内容为空");
    return QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111111",
        light: "#ffffff"
      }
    });
  }
  escapeHtmlAttr(value) {
    return `${value || ""}`.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /**
   * 为Android环境创建二维码对话框
   */
  createAndroidQRDialog(qrImageSrc, onCancel) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
    const dialog = document.createElement("div");
    dialog.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 100%;
        `;
    dialog.innerHTML = `
            <div style="width: 60px; height: 60px; background: #00a1d6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; margin: 0 auto 20px;">B</div>
            <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">扫码登录 Bilibili</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">使用 Bilibili APP 扫描二维码</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <img src="${this.escapeHtmlAttr(qrImageSrc)}" alt="扫码登录" style="width: 200px; height: 200px; display: block; margin: 0 auto;" />
            </div>
            <div style="color: #999; font-size: 13px; line-height: 1.6;">
                <div style="display: inline-block; width: 14px; height: 14px; border: 2px solid #667eea; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                <span style="margin-left: 8px;">等待扫码...</span>
            </div>
            <button id="cancelQRBtn" style="margin-top: 20px; padding: 10px 30px; background: #f0f0f0; border: none; border-radius: 8px; font-size: 14px; color: #666; cursor: pointer;">取消</button>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    const cancelBtn = dialog.querySelector("#cancelQRBtn");
    cancelBtn.addEventListener("click", () => {
      overlay.remove();
      if (typeof onCancel === "function") {
        onCancel();
      }
    });
    return overlay;
  }
  /**
   * 创建扫码弹窗
   */
  createScanWindow(qrImageSrc) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Bilibili 扫码登录</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              max-width: 400px;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: #00a1d6;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 32px;
              font-weight: bold;
              margin: 0 auto 20px;
            }
            h2 {
              font-size: 24px;
              color: #333;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 14px;
              margin-bottom: 30px;
            }
            .qrcode {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 20px;
            }
            .qrcode img {
              width: 200px;
              height: 200px;
              display: block;
              margin: 0 auto;
            }
            .tips {
              color: #999;
              font-size: 13px;
              line-height: 1.6;
            }
            .loading {
              display: inline-block;
              width: 14px;
              height: 14px;
              border: 2px solid #667eea;
              border-radius: 50%;
              border-top-color: transparent;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">B</div>
            <h2>扫码登录 Bilibili</h2>
            <p class="subtitle">使用 Bilibili APP 扫描二维码</p>
            <div class="qrcode">
              <img src="${this.escapeHtmlAttr(qrImageSrc)}" alt="扫码登录" />
            </div>
            <div class="tips">
              <div class="loading"></div>
              <span style="margin-left: 8px;">等待扫码...</span>
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const width = 500;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const win = window.open(
      url,
      "BilibiliQRLogin",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no`
    );
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    return win;
  }
  /**
   * 获取当前授权用户信息
   */
  async getCurrentUser() {
    const response = await apiRequest("/api/auth/bilibili/user");
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  }
  /**
   * 获取所有授权用户列表
   */
  async getAllUsers() {
    return [];
  }
  /**
   * 切换当前用户
   */
  async switchUser(mid) {
    throw new Error("当前版本不支持切换 Bilibili 多账号");
  }
  /**
   * 移除授权
   */
  async removeAuth(mid) {
    throw new Error("当前版本不支持移除 Bilibili 授权");
  }
  /**
   * 检查授权状态
   */
  async checkStatus() {
    const response = await apiRequest("/api/auth/bilibili/status");
    if (response.ok) {
      const result = await response.json();
      const data = result.data || result;
      const status = data.data || data;
      if (status?.authorized) {
        const sessdata = await this.getSessdata().catch(() => null);
        const credentialAvailable = Boolean(sessdata?.authorized && sessdata?.credential_available && sessdata?.sessdata);
        return {
          ...status,
          authorized: credentialAvailable,
          credential_available: credentialAvailable,
          sessdata: credentialAvailable ? sessdata.sessdata : null
        };
      }
      return {
        ...status,
        authorized: false,
        credential_available: false,
        sessdata: null
      };
    }
    return { authorized: false, user: null, credential_available: false, sessdata: null };
  }
  /**
   * 获取当前用户的 SESSDATA（用于视频高画质）
   */
  async getSessdata() {
    const response = await apiRequest("/api/auth/bilibili/sessdata");
    if (response.ok) {
      const result = await response.json();
      const data = result.data || result;
      return data.data || data;
    }
    return { authorized: false, sessdata: null };
  }
}
const biliAuthService = new BiliAuthService();
export {
  biliAuthService as b
};
