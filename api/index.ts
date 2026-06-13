import express from 'express';
import path from 'path';
import fs from 'fs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const app = express();
app.use(express.json());

// Load Firebase configuration dynamically to prevent Node ESM load-time import crashes on Vercel
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    const parentConfigPath = path.join(process.cwd(), '..', 'firebase-applet-config.json');
    if (fs.existsSync(parentConfigPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(parentConfigPath, 'utf-8'));
    }
  }
} catch (e) {
  console.error('[Vercel API] Error reading config file from disk, using fallback static credentials:', e);
}

// Resilient fallback using the exact project's firebase applet credentials
if (!firebaseConfig) {
  firebaseConfig = {
    "projectId": "celtic-mystery-89pl1",
    "appId": "1:465768180437:web:4f94f6915f2d1415f1905c",
    "apiKey": "AIzaSyCciWWvtEJ1lMCn-c7y7LoEouMoH7UVYLQ",
    "authDomain": "celtic-mystery-89pl1.firebaseapp.com",
    "firestoreDatabaseId": "ai-studio-30b33e7b-9d13-4d8d-b432-fa761175e004",
    "storageBucket": "celtic-mystery-89pl1.firebasestorage.app",
    "messagingSenderId": "465768180437",
    "measurementId": ""
  };
}

// Handler helper to initialize firebase and get firestore db instance
function getDb() {
  if (!firebaseConfig) {
    throw new Error('Firebase configuration could not be loaded.');
  }
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel-serverless', hasConfig: !!firebaseConfig });
});

// API Route 1: Mark order as PENDING / Paid (Khách hàng gọi khi bấm "Tôi đã chuyển khoản")
app.put('/api/orders/:id/paid', async (req, res) => {
  const { id } = req.params;
  const orderData = req.body;
  try {
    const db = getDb();
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      await updateDoc(orderRef, { status: 'PENDING' });
    } else {
      await setDoc(orderRef, {
        userId: orderData.userId || 'anonymous',
        items: orderData.items || [],
        totalAmount: orderData.totalAmount || 0,
        status: 'PENDING',
        createdAt: orderData.createdAt || Date.now(),
        paymentMethod: orderData.paymentMethod || 'QR'
      });
    }
    res.json({ success: true, message: 'Xác nhận đã chuyển khoản thành công! Khung thanh toán sẽ chuyển sang chờ duyệt.' });
  } catch (err: any) {
    console.error('[Vercel API] Error confirming payment:', err);
    res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
  }
});

// API Route 2: Approve order (Admin duyệt đơn: PENDING -> SUCCESS và cấp tài khoản game)
app.put('/api/orders/:id/approve', async (req, res) => {
  const { id } = req.params;
  console.log(`[Vercel API Approve] Initiating approval for order ID: ${id}`);
  try {
    const db = getDb();
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    const orderData = orderSnap.data();
    let updatedItems = [...orderData.items];
    
    // Update accounts and fill details
    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.type === 'ACCOUNT') {
        const accountId = item.details?.accountId || item.accountId || item.id;
        const accountRef = doc(db, 'accounts', accountId);
        const accountSnap = await getDoc(accountRef);
        
        if (accountSnap.exists()) {
          const accData = accountSnap.data();
          updatedItems[i] = {
            ...item,
            details: {
              ...(item.details || {}),
              gameUsername: accData.gameUsername || 'game_garena_acc',
              gamePassword: accData.gamePassword || 'Lq_pass_9988'
            }
          };
          // Mark as sold in database
          await updateDoc(accountRef, { isSold: true });
        } else {
          updatedItems[i] = {
            ...item,
            details: {
              ...(item.details || {}),
              gameUsername: 'garena_acc_shop',
              gamePassword: 'garena_password'
            }
          };
        }
      }
    }

    await updateDoc(orderRef, {
      status: 'SUCCESS',
      items: updatedItems
    });

    res.json({ success: true, message: 'Duyệt đơn hàng thành công!' });
  } catch (err: any) {
    console.error('[Vercel API] Error approving order:', err);
    res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
  }
});

// API Route 3: Cancel order (Admin hủy đơn: PENDING -> CANCELLED)
app.put('/api/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    await updateDoc(orderRef, {
      status: 'CANCELLED'
    });

    res.json({ success: true, message: 'Hủy đơn hàng thành công!' });
  } catch (err: any) {
    console.error('[Vercel API] Error cancelling order:', err);
    res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
  }
});

export default app;
