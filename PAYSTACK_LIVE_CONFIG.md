# 🚀 Paystack Live Configuration

## ✅ Your Live API Keys

**Public Key:** `pk_live_YOUR_PUBLIC_KEY_HERE`  
**Secret Key:** `sk_live_YOUR_SECRET_KEY_HERE`

---

## 🔧 Configuration Steps

### **Step 1: Create Environment File**

Create `/client/.env.local` with these contents:

```bash
# ==================
# SUPABASE CONFIGURATION
# ==================
REACT_APP_SUPABASE_URL=https://waasqqbklnhfrbzfuvzn.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# ==================
# PAYSTACK PAYMENT (LIVE MODE)
# ==================
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=pk_live_YOUR_PUBLIC_KEY_HERE
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=pk_test_xxxxxxxxxxxxx
REACT_APP_PAYMENT_MODE=live

# ==================
# EMAIL SERVICE (Resend)
# ==================
RESEND_API_KEY=your-resend-key-here

# ==================
# OFFICIAL EMAIL ADDRESSES
# ==================
SUPPORT_EMAIL=infoajumapro@gmail.com
CONTACT_EMAIL=infoajumapro@gmail.com
EVENTS_EMAIL=infoajumapro@gmail.com
```

### **Step 2: Set Supabase Secret**

```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
```

### **Step 3: Deploy Edge Function**

```bash
supabase functions deploy verify-paystack-payment
```

### **Step 4: Install Dependencies**

```bash
cd client
npm install react-paystack
```

### **Step 5: Test with Small Payment**

1. Start dev server: `npm start`
2. Go to `/app/billing`
3. Click "Upgrade to Pro"
4. Use your real card with small amount
5. Verify payment processes correctly

---

## ⚠️ Important Notes

### **Live Mode Considerations:**

1. **Real Money:** Live mode processes real payments
2. **KYC Required:** You must complete KYC verification in Paystack
3. **Business Info:** Ensure business details are complete
4. **Webhook Setup:** Consider setting up webhooks for production
5. **Monitoring:** Monitor transactions in Paystack Dashboard

### **Security:**

- ✅ Secret key is server-side only
- ✅ Public key is safe to expose
- ✅ All payments verified on backend
- ✅ HTTPS enforced by Supabase

### **Testing:**

- Use small amounts for initial testing
- Test with your own card first
- Verify plan upgrades work
- Check email confirmations
- Monitor Supabase logs

---

## 🎯 Production Checklist

Before going fully live:

- [ ] Complete Paystack KYC verification
- [ ] Test with small real payment
- [ ] Verify plan upgrades work
- [ ] Check email confirmations
- [ ] Monitor first transactions
- [ ] Set up webhook endpoints (optional)
- [ ] Enable fraud detection
- [ ] Have support team ready
- [ ] Test refund process
- [ ] Monitor Paystack Dashboard

---

## 📊 Expected Revenue

### **Pro Plan (₵600/month):**
- Customer pays: ₵600
- Paystack fee: ₵10 (1.95% capped)
- **You receive: ₵590**

### **Enterprise Plan (₵1,800/month):**
- Customer pays: ₵1,800
- Paystack fee: ₵10 (1.95% capped)
- **You receive: ₵1,790**

---

## 🆘 Support

**Paystack Support:**
- Email: support@paystack.com
- Phone: +234 1 888 2800

**Your Support:**
- Email: infoajumapro@gmail.com
- Phone: +233 24 973 9599 / +233 50 698 5503

---

## 🎉 Ready to Go Live!

Your Paystack integration is now configured for production. Follow the steps above to deploy and start accepting real payments!




