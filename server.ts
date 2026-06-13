import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Read Firebase Config securely
  const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

  app.use(express.json());

  // API Route 1: Mark order as PENDING / Paid (Khách hàng gọi khi bấm "Tôi đã chuyển khoản")
  app.put('/api/orders/:id/paid', async (req, res) => {
    const { id } = req.params;
    const orderData = req.body;
    try {
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
      console.error('Error confirming payment: ', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
    }
  });

  // API Route 2: Approve order (Admin duyệt đơn: PENDING -> SUCCESS và cấp tài khoản game)
  app.put('/api/orders/:id/approve', async (req, res) => {
    const { id } = req.params;
    console.log(`[API APPROVE] Inidating approval for order ID: ${id}`);
    try {
      const orderRef = doc(db, 'orders', id);
      let orderSnap;
      try {
        orderSnap = await getDoc(orderRef);
      } catch (err: any) {
        console.error('[API APPROVE] Error getting order doc:', err);
        throw new Error(`getDoc(order) failed: ${err.message}`);
      }
      
      if (!orderSnap.exists()) {
        console.log(`[API APPROVE] Order ID ${id} not found.`);
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
      }
      
      const orderData = orderSnap.data();
      let updatedItems = [...orderData.items];
      
      // Update accounts and fill details
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        if (item.type === 'ACCOUNT') {
          const accountId = item.details?.accountId || item.accountId || item.id;
          console.log(`[API APPROVE] Order contains account item: ${accountId}`);
          const accountRef = doc(db, 'accounts', accountId);
          let accountSnap;
          try {
            accountSnap = await getDoc(accountRef);
          } catch (err: any) {
            console.error(`[API APPROVE] Error getting account doc for ${accountId}:`, err);
            throw new Error(`getDoc(account:${accountId}) failed: ${err.message}`);
          }
          
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
            console.log(`[API APPROVE] Marking account ${accountId} as sold (isSold = true)`);
            try {
              await updateDoc(accountRef, { isSold: true });
            } catch (err: any) {
              console.error(`[API APPROVE] Error updating account ${accountId} to isSold:`, err);
              throw new Error(`updateDoc(account:${accountId}) isSold: true failed: ${err.message}`);
            }
          } else {
            console.log(`[API APPROVE] Account ${accountId} does not exist in DB, using fallback credentials.`);
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

      console.log(`[API APPROVE] Updating order status to SUCCESS and updating items with credentials.`);
      try {
        await updateDoc(orderRef, {
          status: 'SUCCESS', // Transition status to SUCCESS as requested
          items: updatedItems
        });
      } catch (err: any) {
        console.error(`[API APPROVE] Error updating order status for ${id}:`, err);
        throw new Error(`updateDoc(order:${id}) failed to set status and items: ${err.message}`);
      }

      console.log(`[API APPROVE] Approved order ${id} successfully!`);
      res.json({ success: true, message: 'Duyệt đơn hàng thành công!' });
    } catch (err: any) {
      console.error('Error approving order: ', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
    }
  });

  // API Route 3: Cancel order (Admin hủy đơn: PENDING -> CANCELLED)
  app.put('/api/orders/:id/cancel', async (req, res) => {
    const { id } = req.params;
    try {
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
      console.error('Error cancelling order: ', err);
      res.status(500).json({ success: false, error: err.message || 'Lỗi server' });
    }
  });

  // Serve Frontend with standard Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
