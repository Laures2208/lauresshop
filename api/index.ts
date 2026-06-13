import express from 'express';
import path from 'path';
import fs from 'fs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = express();
app.use(express.json());

// Handler helper to initialize firebase and get firestore db instance
function getDb() {
  if (!firebaseConfig) {
    throw new Error('Firebase configuration could not be loaded. Please ensure firebase-applet-config.json is present in the workspace.');
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
