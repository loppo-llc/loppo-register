import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, RefreshCw, FileText } from 'lucide-react';
import LicenseScreen from './LicenseScreen';

// 言語設定
const translations = {
  ja: {
    title: 'セルフレジシステム',
    scanTitle: '商品スキャン',
    scanDescription: 'お手元のバーコードスキャナーで、購入したい商品のバーコードを読み取ってください',
    scanPlaceholder: 'バーコードをスキャンまたは入力してください',
    addButton: '追加',
    manualAddTitle: '手動での商品追加：',
    loading: '読み込み中...',
    loadingComplete: '商品データ読み込み完了',
    cartTitle: 'カート',
    emptyCart: 'カートに商品がありません',
    total: '合計',
    proceedToCheckout: '会計に進む',
    selectPayment: 'お支払い方法を選択してください',
    creditDebit: 'クレジット・デビットカード',
    transitIC: '交通系IC',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'QRコード決済',
    cancel: 'キャンセル',
    cardInstruction: 'カードを決済端末に挿入またはタッチしてください',
    transitInstruction: '交通系ICカード・スマートフォンを決済端末にタッチしてください',
    idInstruction: 'iD対応カード・スマートフォンを決済端末にタッチしてください',
    quicpayInstruction: 'QUICPay対応カード・スマートフォンを決済端末にタッチしてください',
    qrInstruction: '決済端末に表示されるQRコードをスマートフォンで読み取ってください',
    paymentComplete: 'お支払いが完了しました！',
    receiptPrinted: 'レシートが印刷されました。ご利用ありがとうございました。',
    startNewShopping: '新しい買い物を始める',
    addedToCart: '「{name}」をカートに追加しました',
    itemNotFound: '商品が見つかりませんでした',
    emptyCartMessage: 'カートを空にしました',
    noItemsInCart: 'カートに商品がありません',
    processingPayment: '決済処理を開始しています...',
    pleasePayAtTerminal: '決済端末でお支払いをお願いします...',
    paymentCompleted: '決済が完了しました！レシートを印刷しています...',
    paymentFailed: '決済に失敗しました。もう一度お試しください。',
    paymentCanceled: '決済がキャンセルされました。',
    processing: '決済処理中...',
    statusCheckFailed: '決済状況の確認に失敗しました',
    errorDuringPayment: '決済処理中にエラーが発生しました',
    licenseInfo: 'ライセンス情報',
    licenseTitle: 'オープンソースライセンス',
    licenseDescription: 'このアプリケーションは以下のオープンソースライブラリを使用しています：',
    version: 'バージョン',
    license: 'ライセンス',
    showFullLicense: 'ライセンス全文を表示',
    hideLicense: '閉じる',
    close: '閉じる'
  },
  en: {
    title: 'Self-Checkout System',
    scanTitle: 'Product Scan',
    scanDescription: 'Please scan the barcode of the items you wish to purchase using the barcode scanner',
    scanPlaceholder: 'Scan or enter barcode',
    addButton: 'Add',
    manualAddTitle: 'Manual item addition:',
    loading: 'Loading...',
    loadingComplete: 'Product data loaded',
    cartTitle: 'Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    selectPayment: 'Select Payment Method',
    creditDebit: 'Credit/Debit Card',
    transitIC: 'Transit IC',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'QR Code Payment',
    cancel: 'Cancel',
    cardInstruction: 'Insert or tap your card at the payment terminal',
    transitInstruction: 'Tap your transit IC card or smartphone at the payment terminal',
    idInstruction: 'Tap your iD compatible card or smartphone at the payment terminal',
    quicpayInstruction: 'Tap your QUICPay compatible card or smartphone at the payment terminal',
    qrInstruction: 'Scan the QR code displayed on the payment terminal with your smartphone',
    paymentComplete: 'Payment Completed!',
    receiptPrinted: 'Your receipt has been printed. Thank you for your purchase.',
    startNewShopping: 'Start New Shopping',
    addedToCart: '"{name}" added to cart',
    itemNotFound: 'Item not found',
    emptyCartMessage: 'Cart emptied',
    noItemsInCart: 'No items in cart',
    processingPayment: 'Starting payment process...',
    pleasePayAtTerminal: 'Please pay at the terminal...',
    paymentCompleted: 'Payment completed! Printing receipt...',
    paymentFailed: 'Payment failed. Please try again.',
    paymentCanceled: 'Payment canceled.',
    processing: 'Processing payment...',
    statusCheckFailed: 'Failed to check payment status',
    errorDuringPayment: 'Error occurred during payment process',
    licenseInfo: 'License Information',
    licenseTitle: 'Open Source Licenses',
    licenseDescription: 'This application uses the following open source libraries:',
    version: 'Version',
    license: 'License',
    showFullLicense: 'Show Full License',
    hideLicense: 'Hide',
    close: 'Close'
  },
  fr: {
    title: 'Système de Caisse Automatique',
    scanTitle: 'Scan des Produits',
    scanDescription: 'Veuillez scanner le code-barres des articles que vous souhaitez acheter à l\'aide du scanner',
    scanPlaceholder: 'Scanner ou saisir le code-barres',
    addButton: 'Ajouter',
    manualAddTitle: 'Ajout manuel d\'articles :',
    loading: 'Chargement...',
    loadingComplete: 'Données produits chargées',
    cartTitle: 'Panier',
    emptyCart: 'Votre panier est vide',
    total: 'Total',
    proceedToCheckout: 'Procéder au Paiement',
    selectPayment: 'Sélectionnez un Mode de Paiement',
    creditDebit: 'Carte de Crédit/Débit',
    transitIC: 'Carte IC de Transport',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'Paiement QR Code',
    cancel: 'Annuler',
    cardInstruction: 'Insérez ou tapotez votre carte sur le terminal de paiement',
    transitInstruction: 'Tapotez votre carte IC de transport ou smartphone sur le terminal',
    idInstruction: 'Tapotez votre carte ou smartphone compatible iD sur le terminal',
    quicpayInstruction: 'Tapotez votre carte ou smartphone compatible QUICPay sur le terminal',
    qrInstruction: 'Scannez le QR code affiché sur le terminal avec votre smartphone',
    paymentComplete: 'Paiement Effectué !',
    receiptPrinted: 'Votre reçu a été imprimé. Merci pour votre achat.',
    startNewShopping: 'Commencer Nouvel Achat',
    addedToCart: '"{name}" ajouté au panier',
    itemNotFound: 'Article non trouvé',
    emptyCartMessage: 'Panier vidé',
    noItemsInCart: 'Aucun article dans le panier',
    processingPayment: 'Démarrage du processus de paiement...',
    pleasePayAtTerminal: 'Veuillez payer au terminal...',
    paymentCompleted: 'Paiement effectué ! Impression du reçu...',
    paymentFailed: 'Échec du paiement. Veuillez réessayer.',
    paymentCanceled: 'Paiement annulé.',
    processing: 'Traitement du paiement...',
    statusCheckFailed: 'Échec de la vérification du statut de paiement',
    errorDuringPayment: 'Une erreur s\'est produite pendant le processus de paiement',
    licenseInfo: 'Informations de Licence',
    licenseTitle: 'Licences Open Source',
    licenseDescription: 'Cette application utilise les bibliothèques open source suivantes :',
    version: 'Version',
    license: 'Licence',
    showFullLicense: 'Afficher la licence complète',
    hideLicense: 'Masquer',
    close: 'Fermer'
  },
  es: {
    title: 'Sistema de Autoservicio',
    scanTitle: 'Escaneo de Productos',
    scanDescription: 'Por favor, escanee el código de barras de los artículos que desea comprar usando el escáner',
    scanPlaceholder: 'Escanee o ingrese el código de barras',
    addButton: 'Añadir',
    manualAddTitle: 'Adición manual de artículos:',
    loading: 'Cargando...',
    loadingComplete: 'Datos de productos cargados',
    cartTitle: 'Carrito',
    emptyCart: 'Su carrito está vacío',
    total: 'Total',
    proceedToCheckout: 'Proceder al Pago',
    selectPayment: 'Seleccione Método de Pago',
    creditDebit: 'Tarjeta de Crédito/Débito',
    transitIC: 'IC de Transporte',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'Pago con Código QR',
    cancel: 'Cancelar',
    cardInstruction: 'Inserte o toque su tarjeta en el terminal de pago',
    transitInstruction: 'Toque su tarjeta IC de transporte o smartphone en el terminal',
    idInstruction: 'Toque su tarjeta o smartphone compatible con iD en el terminal',
    quicpayInstruction: 'Toque su tarjeta o smartphone compatible con QUICPay en el terminal',
    qrInstruction: 'Escanee el código QR mostrado en el terminal con su smartphone',
    paymentComplete: '¡Pago Completado!',
    receiptPrinted: 'Su recibo ha sido impreso. Gracias por su compra.',
    startNewShopping: 'Iniciar Nueva Compra',
    addedToCart: '"{name}" añadido al carrito',
    itemNotFound: 'Artículo no encontrado',
    emptyCartMessage: 'Carrito vaciado',
    noItemsInCart: 'No hay artículos en el carrito',
    processingPayment: 'Iniciando proceso de pago...',
    pleasePayAtTerminal: 'Por favor, pague en el terminal...',
    paymentCompleted: '¡Pago completado! Imprimiendo recibo...',
    paymentFailed: 'Pago fallido. Por favor, inténtelo de nuevo.',
    paymentCanceled: 'Pago cancelado.',
    processing: 'Procesando pago...',
    statusCheckFailed: 'Error al verificar el estado del pago',
    errorDuringPayment: 'Se produjo un error durante el proceso de pago',
    licenseInfo: 'Información de Licencia',
    licenseTitle: 'Licencias de Código Abierto',
    licenseDescription: 'Esta aplicación utiliza las siguientes bibliotecas de código abierto:',
    version: 'Versión',
    license: 'Licencia',
    showFullLicense: 'Mostrar licencia completa',
    hideLicense: 'Ocultar',
    close: 'Cerrar'
  },
  zh_hant: {
    title: '自助結帳系統',
    scanTitle: '商品掃描',
    scanDescription: '請使用條碼掃描器掃描您要購買的商品條碼',
    scanPlaceholder: '掃描或輸入條碼',
    addButton: '添加',
    manualAddTitle: '手動添加商品：',
    loading: '載入中...',
    loadingComplete: '商品數據已載入',
    cartTitle: '購物車',
    emptyCart: '您的購物車是空的',
    total: '總計',
    proceedToCheckout: '進行結帳',
    selectPayment: '選擇支付方式',
    creditDebit: '信用卡/簽帳卡',
    transitIC: '交通IC卡',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'QR碼支付',
    cancel: '取消',
    cardInstruction: '請在支付終端插入或輕觸您的卡',
    transitInstruction: '請在支付終端輕觸您的交通IC卡或智能手機',
    idInstruction: '請在支付終端輕觸您的iD兼容卡或智能手機',
    quicpayInstruction: '請在支付終端輕觸您的QUICPay兼容卡或智能手機',
    qrInstruction: '請用智能手機掃描支付終端上顯示的QR碼',
    paymentComplete: '支付完成！',
    receiptPrinted: '您的收據已打印。感謝您的購買。',
    startNewShopping: '開始新的購物',
    addedToCart: '已將"{name}"添加到購物車',
    itemNotFound: '未找到商品',
    emptyCartMessage: '購物車已清空',
    noItemsInCart: '購物車中沒有商品',
    processingPayment: '正在開始支付處理...',
    pleasePayAtTerminal: '請在終端支付...',
    paymentCompleted: '支付完成！正在打印收據...',
    paymentFailed: '支付失敗。請重試。',
    paymentCanceled: '支付已取消。',
    processing: '正在處理支付...',
    statusCheckFailed: '檢查支付狀態失敗',
    errorDuringPayment: '支付過程中發生錯誤',
    licenseInfo: '授權資訊',
    licenseTitle: '開源授權',
    licenseDescription: '本應用程式使用了以下開源庫：',
    version: '版本',
    license: '授權',
    showFullLicense: '顯示完整授權',
    hideLicense: '隱藏',
    close: '關閉'
  },
  zh_hans: {
    title: '自助结账系统',
    scanTitle: '商品扫描',
    scanDescription: '请使用条码扫描器扫描您要购买的商品条码',
    scanPlaceholder: '扫描或输入条码',
    addButton: '添加',
    manualAddTitle: '手动添加商品：',
    loading: '加载中...',
    loadingComplete: '商品数据已加载',
    cartTitle: '购物车',
    emptyCart: '您的购物车是空的',
    total: '总计',
    proceedToCheckout: '进行结账',
    selectPayment: '选择支付方式',
    creditDebit: '信用卡/借记卡',
    transitIC: '交通IC卡',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: '二维码支付',
    cancel: '取消',
    cardInstruction: '请在支付终端插入或轻触您的卡',
    transitInstruction: '请在支付终端轻触您的交通IC卡或智能手机',
    idInstruction: '请在支付终端轻触您的iD兼容卡或智能手机',
    quicpayInstruction: '请在支付终端轻触您的QUICPay兼容卡或智能手机',
    qrInstruction: '请用智能手机扫描支付终端上显示的二维码',
    paymentComplete: '支付完成！',
    receiptPrinted: '您的收据已打印。感谢您的购买。',
    startNewShopping: '开始新的购物',
    addedToCart: '已将"{name}"添加到购物车',
    itemNotFound: '未找到商品',
    emptyCartMessage: '购物车已清空',
    noItemsInCart: '购物车中没有商品',
    processingPayment: '正在开始支付处理...',
    pleasePayAtTerminal: '请在终端支付...',
    paymentCompleted: '支付完成！正在打印收据...',
    paymentFailed: '支付失败。请重试。',
    paymentCanceled: '支付已取消。',
    processing: '正在处理支付...',
    statusCheckFailed: '检查支付状态失败',
    errorDuringPayment: '支付过程中发生错误',
    licenseInfo: '许可证信息',
    licenseTitle: '开源许可证',
    licenseDescription: '本应用程序使用了以下开源库：',
    version: '版本',
    license: '许可证',
    showFullLicense: '显示完整许可证',
    hideLicense: '隐藏',
    close: '关闭'
  },
  ko: {
    title: '셀프 계산대 시스템',
    scanTitle: '상품 스캔',
    scanDescription: '구매하려는 상품의 바코드를 바코드 스캐너로 스캔해 주세요',
    scanPlaceholder: '바코드 스캔 또는 입력',
    addButton: '추가',
    manualAddTitle: '수동 상품 추가:',
    loading: '로딩 중...',
    loadingComplete: '상품 데이터 로드 완료',
    cartTitle: '장바구니',
    emptyCart: '장바구니가 비어 있습니다',
    total: '합계',
    proceedToCheckout: '결제 진행',
    selectPayment: '결제 방법 선택',
    creditDebit: '신용/체크 카드',
    transitIC: '교통 IC 카드',
    id: 'iD',
    quicpay: 'QUICPay',
    qrCode: 'QR코드 결제',
    cancel: '취소',
    cardInstruction: '결제 단말기에 카드를 삽입하거나 터치해 주세요',
    transitInstruction: '결제 단말기에 교통 IC 카드나 스마트폰을 터치해 주세요',
    idInstruction: '결제 단말기에 iD 호환 카드나 스마트폰을 터치해 주세요',
    quicpayInstruction: '결제 단말기에 QUICPay 호환 카드나 스마트폰을 터치해 주세요',
    qrInstruction: '스마트폰으로 결제 단말기에 표시된 QR코드를 스캔해 주세요',
    paymentComplete: '결제 완료!',
    receiptPrinted: '영수증이 인쇄되었습니다. 구매해 주셔서 감사합니다.',
    startNewShopping: '새 쇼핑 시작',
    addedToCart: '"{name}" 장바구니에 추가됨',
    itemNotFound: '상품을 찾을 수 없습니다',
    emptyCartMessage: '장바구니를 비웠습니다',
    noItemsInCart: '장바구니에 상품이 없습니다',
    processingPayment: '결제 과정을 시작합니다...',
    pleasePayAtTerminal: '단말기에서 결제해 주세요...',
    paymentCompleted: '결제가 완료되었습니다! 영수증을 인쇄 중...',
    paymentFailed: '결제 실패. 다시 시도해 주세요.',
    paymentCanceled: '결제가 취소되었습니다.',
    processing: '결제 처리 중...',
    statusCheckFailed: '결제 상태 확인 실패',
    errorDuringPayment: '결제 과정 중 오류가 발생했습니다',
    licenseInfo: '라이선스 정보',
    licenseTitle: '오픈소스 라이선스',
    licenseDescription: '이 응용 프로그램은 다음 오픈소스 라이브러리를 사용합니다:',
    version: '버전',
    license: '라이선스',
    showFullLicense: '전체 라이선스 보기',
    hideLicense: '숨기기',
    close: '닫기'
  }
};

// 言語選択肢
const languageOptions = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'zh_hant', name: '繁體中文' },
  { code: 'zh_hans', name: '简体中文' },
  { code: 'ko', name: '한국어' }
];

// メインアプリケーション
const App = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('ready'); // ready, processing, complete
  const [statusMessage, setStatusMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [catalogItems, setCatalogItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // 決済手段選択用の状態
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);
  const [language, setLanguage] = useState('ja'); // デフォルト言語を日本語に設定
  const inputRef = useRef(null);

  // 言語設定を取得
  const t = translations[language];

  // ピンチズーム無効化
  useEffect(() => {
    const handleTouchStart = (e) => {
      // タッチポイントが2つ以上（ピンチ操作と判断）の場合、イベントをキャンセル
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    // passive: falseを指定して preventDefault が機能するようにする
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // カタログデータの取得
  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        setIsLoading(true);

        const res = await fetch("/api/catalog-items");
        if (!res.ok) throw new Error("カタログデータの取得に失敗しました");

        /** @type {Array} */
        const items = await res.json();

        const map = {};

        items
          .forEach((item) => {
            (item.variations || []).forEach((v) => {
              const vData = v.itemVariationData ?? {};
              const upc = vData.upc ?? "";
              const barcode =
                upc ||
                `TEST-${v.id}`; // GTIN無し → テスト用ダミー

              map[barcode] = {
                id: v.id,
                name: `${item.name}${
                  vData.name ? ` - ${vData.name}` : ""
                }`,
                price: vData.priceMoney
                  ? Number(vData.priceMoney.amount) // BigInt → number
                  : 0,
                image: item.imageUrl || "/api/placeholder/80/80",
                barcode,
                categoryName: item.categoryName, // 後で使う場合のために保持
              };
            });
          });

        setCatalogItems(map);

        setLoadingError(null);
      } catch (err) {
        console.error(err);
        setLoadingError(err.message);
      } finally {
        setIsLoading(false);
        refocusInput();
      }
    };

    fetchCatalogItems();
  }, []);

  // status変更時にも入力フィールドにフォーカス
  useEffect(() => {
    if (status === 'ready') {
      refocusInput();
    }
  }, [status]);

  // 支払完了画面から自動的に商品スキャン画面に戻るタイマー
  useEffect(() => {
    let timer;
    if (status === 'complete') {
      timer = setTimeout(() => {
        startNewTransaction();
      }, 10000); // 10秒後に自動遷移
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);

  // バーコード入力フォーカス管理のユーティリティ関数
  const refocusInput = () => {
    setTimeout(() => {
      if (inputRef.current && status === 'ready') {
        inputRef.current.focus();
      }
    }, 100);
  };

  // ウィンドウがアクティブになったときにフォーカスを戻す
  useEffect(() => {
    const handleWindowFocus = () => {
      if (status === 'ready') {
        refocusInput();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [status]);

  // ドキュメント内クリック時のフォーカス管理
  const handleDocumentClick = (e) => {
    // 入力フィールド自体やボタンがクリックされた場合はスキップ
    if (
      (inputRef.current && inputRef.current.contains(e.target)) ||
      e.target.tagName === 'BUTTON' ||
      e.target.closest('button')
    ) {
      return;
    }
    
    // それ以外の領域がクリックされ、かつready状態の場合は入力欄にフォーカス
    if (status === 'ready') {
      refocusInput();
    }
  };

  // 合計金額の計算
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  // バーコード入力処理
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    
    if (!barcodeInput) return;
    
    const item = catalogItems[barcodeInput];
    
    if (item) {
      // カートに商品を追加
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // 既存の商品の数量を増やす
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        // 新しい商品をカートに追加
        setCart([...cart, { ...item, quantity: 1 }]);
      }
      
      setStatusMessage(t.addedToCart.replace('{name}', item.name));
      setTimeout(() => setStatusMessage(''), 2000);
    } else {
      setStatusMessage(t.itemNotFound);
      setTimeout(() => setStatusMessage(''), 2000);
    }
    
    // 入力欄をクリアしてフォーカス
    setBarcodeInput('');
    refocusInput();
  };

  // キーボードイベント監視
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESCキーでキャンセル
      if (e.key === 'Escape' && status === 'select-payment') {
        setStatus('ready');
      }
      
      // Readyステートでなければ何もしない
      if (status !== 'ready') return;
      
      // 特殊キーやショートカットは無視
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      // 入力欄にフォーカスがない場合のみ
      if (document.activeElement !== inputRef.current) {
        // 入力されたキーが文字や数字の場合、入力欄にフォーカスして値を設定
        if (e.key.length === 1 && /[\w\d]/.test(e.key)) {
          if (inputRef.current) {
            inputRef.current.focus();
            // 既存の値がある場合はクリア
            setBarcodeInput(e.key);
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  // 商品の数量を変更後にフォーカスを戻す
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    refocusInput();
  };

  // 商品をカートから削除後にフォーカスを戻す
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
    refocusInput();
  };

  // カートをクリア後にフォーカスを戻す
  const clearCart = () => {
    setCart([]);
    setStatusMessage(t.emptyCartMessage);
    setTimeout(() => setStatusMessage(''), 2000);
    refocusInput();
  };

  // 会計画面表示
  const showPaymentMethodSelection = () => {
    if (cart.length === 0) {
      setStatusMessage(t.noItemsInCart);
      setTimeout(() => setStatusMessage(''), 2000);
      return;
    }
    
    setStatus('select-payment');
  };

  // 決済手段選択後の処理
  const selectPaymentMethod = (method) => {
    setPaymentMethod(method);
    handleCheckout(method);
  };

  // 決済処理
  const handleCheckout = async (selectedPaymentMethod) => {
    try {
      setStatus('processing');
      setPaymentStatus(t.processingPayment);
      
      // 注文情報を作成
      const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity.toString(),
        basePriceMoney: {
          amount: item.price,
          currency: 'JPY'
        }
      }));
      
      // バックエンドAPIに決済リクエストを送信
      const response = await fetch('/api/create-terminal-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            lineItems: orderItems
          },
          amountMoney: {
            amount: total,
            currency: 'JPY'
          },
          paymentType: selectedPaymentMethod // 選択された決済手段を送信
        }),
      });
      
      if (!response.ok) {
        throw new Error(t.errorDuringPayment);
      }
      
      const data = await response.json();
      
      // 決済ステータスの確認
      setPaymentStatus(t.pleasePayAtTerminal);
      
      // 決済状況をポーリングで確認
      const checkPaymentStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/get-checkout-status?checkoutId=${data.checkout.id}`);
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'COMPLETED') {
            setPaymentStatus(t.paymentCompleted);
            // 完了処理
            setTimeout(() => {
              setStatus('complete');
              setCart([]);
            }, 2000);
          } else if (statusData.status === 'FAILED') {
            setPaymentStatus(t.paymentFailed);
            setTimeout(() => {
              setStatus('ready');
            }, 3000);
          } else if (statusData.status === 'CANCELED' || statusData.status === 'CANCEL_REQUESTED') {
            setPaymentStatus(t.paymentCanceled);
            setTimeout(() => {
              setStatus('ready');
            }, 3000);
          } else {
            // まだ完了していない場合は再確認
            setPaymentStatus(t.processing);
            setTimeout(checkPaymentStatus, 2000);
          }
        } catch (error) {
          console.error(t.statusCheckFailed, error);
          setPaymentStatus(t.statusCheckFailed);
          setTimeout(() => {
            setStatus('ready');
          }, 3000);
        }
      };
      
      // 決済状況の確認を開始
      checkPaymentStatus();
      
    } catch (error) {
      console.error(t.errorDuringPayment, error);
      setPaymentStatus(t.errorDuringPayment);
      setTimeout(() => {
        setStatus('ready');
      }, 3000);
    }
  };

  // 新しい買い物を開始
  const startNewTransaction = () => {
    setStatus('ready');
    setPaymentStatus('');
    setPaymentMethod(null);
    // 言語を日本語にリセット
    setLanguage('ja');
    // setTimeout で遅延させることでステートの更新後に確実にフォーカスする
    setTimeout(() => refocusInput(), 100);
  };

  // メイン画面のレンダリング
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-[1800px] w-full mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">{t.title}</h1>
          
          {/* ライセンス情報ボタン */}
          <button
            onClick={() => setShowLicenseInfo(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm transition-colors"
            aria-label={t.licenseInfo}
            title={t.licenseInfo}
          >
            <FileText size={16} />
            <span className="hidden sm:inline">{t.licenseInfo}</span>
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow w-full max-w-[1800px] mx-auto px-4 py-6 md:flex">
        {status === 'ready' && (
          <>
            {/* 商品スキャンエリア */}
            <div className="md:w-8/12 bg-white rounded-lg shadow-md p-8 mb-4 md:mr-6 md:mb-0">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-6 flex items-center">
                  <Package className="mr-3" size={32} />
                  {t.scanTitle}
                </h2>
                
                <p className="text-lg text-gray-700 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  {t.scanDescription}
                </p>
                
                <form onSubmit={handleBarcodeSubmit} className="mb-6" onClick={refocusInput}>
                  <div className="flex">
                    <input
                      type="text"
                      ref={inputRef}
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder={t.scanPlaceholder}
                      className="flex-grow p-4 text-xl border-2 border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onBlur={(e) => {
                        // フォーカスが外れたら100ms後に再フォーカス
                        // これによりクリックイベントやボタン操作での一時的なフォーカス移動後に戻る
                        setTimeout(() => {
                          // 他のインタラクティブ要素にフォーカスがある場合はスキップ
                          const activeElement = document.activeElement;
                          if (
                            ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(activeElement.tagName)
                          ) {
                            return;
                          }
                          e.target.focus();
                        }, 100);
                      }}
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-4 text-xl font-medium rounded-r hover:bg-blue-600 transition-colors"
                    >
                      {t.addButton}
                    </button>
                  </div>
                </form>
                
                {statusMessage && (
                  <div className="bg-blue-100 text-blue-800 p-4 rounded mb-6 text-xl">
                    {statusMessage}
                  </div>
                )}
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">{t.manualAddTitle}</h3>
                    {isLoading ? (
                      <span className="text-gray-500 flex items-center text-lg">
                        <RefreshCw className="animate-spin mr-2" size={24} />
                        {t.loading}
                      </span>
                    ) : loadingError ? (
                      <span className="text-red-500 text-lg">{loadingError}</span>
                    ) : (
                      <span className="text-green-500 text-lg">{t.loadingComplete}</span>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="py-8 text-center text-gray-500 text-xl">{t.loading}</div>
                  ) : (
                    <ul className="space-y-2 text-lg text-gray-600 max-h-[500px] overflow-y-auto border-2 rounded p-4">
                      {Object.entries(catalogItems).map(([barcode, item]) => (
                        <li key={barcode}>
                          <button 
                            onClick={() => {
                              setBarcodeInput(barcode);
                              setTimeout(() => handleBarcodeSubmit({ preventDefault: () => {} }), 100);
                            }}
                            className="text-blue-500 hover:underline w-full text-left py-3 px-4 hover:bg-gray-100 rounded flex justify-between text-xl"
                          >
                            <span>{barcode} - {item.name}</span>
                            <span className="font-medium">¥{item.price}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* カートエリア */}
            <div className="md:w-4/12 bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold flex items-center">
                  <ShoppingCart className="mr-3" size={32} />
                  {t.cartTitle}
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  disabled={cart.length === 0}
                >
                  <Trash2 size={28} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-10 text-xl">{t.emptyCart}</p>
              ) : (
                <div className="mb-6 max-h-[500px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center border-b py-4">
                      {item.image && item.image !== "/api/placeholder/80/80" && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                      )}
                      <div className="flex-grow">
                        <h3 className="font-medium text-xl">{item.name}</h3>
                        <p className="text-gray-600 text-lg">¥{item.price}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-500 hover:text-gray-700 p-2"
                        >
                          <Minus size={24} />
                        </button>
                        <span className="px-3 text-xl">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-500 hover:text-gray-700 p-2"
                        >
                          <Plus size={24} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 ml-3 p-2"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-6">
                <div className="flex justify-between text-2xl font-bold mb-6">
                  <span>{t.total}</span>
                  <span>¥{total}</span>
                </div>
                <button
                  onClick={showPaymentMethodSelection}
                  disabled={cart.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-2xl font-bold shadow-lg transform hover:scale-105"
                >
                  <CreditCard className="mr-3" size={32} />
                  {t.proceedToCheckout}
                </button>
              </div>
            </div>
          </>
        )}

        {status === 'select-payment' && (
          <div className="w-full bg-white rounded-lg shadow-md p-10">
            <h2 className="text-4xl font-semibold mb-8 text-center">{t.selectPayment}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <button
                onClick={() => selectPaymentMethod('CARD_PRESENT')}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 py-12 px-6 rounded-lg transition-colors flex flex-col items-center justify-between h-96"
              >
                <div className="flex-grow flex items-center justify-center">
                  <img 
                    src="/images/card.png" 
                    alt={t.creditDebit} 
                    className="h-64 object-contain" 
                  />
                </div>
                <span className="text-2xl font-medium mt-4">{t.creditDebit}</span>
              </button>
              
              <button
                onClick={() => selectPaymentMethod('FELICA_TRANSPORTATION_GROUP')}
                className="bg-white border-2 border-gray-200 hover:border-green-500 text-gray-800 py-12 px-6 rounded-lg transition-colors flex flex-col items-center justify-between h-96"
              >
                <div className="flex-grow flex items-center justify-center">
                  <img 
                    src="/images/felica-transportation.png" 
                    alt={t.transitIC}
                    className="h-64 object-contain" 
                  />
                </div>
                <span className="text-2xl font-medium mt-4">{t.transitIC}</span>
              </button>
              
              <button
                onClick={() => selectPaymentMethod('FELICA_ID')}
                className="bg-white border-2 border-gray-200 hover:border-teal-500 text-gray-800 py-12 px-6 rounded-lg transition-colors flex flex-col items-center justify-between h-96"
              >
                <div className="flex-grow flex items-center justify-center">
                  <img 
                    src="/images/felica-id.png" 
                    alt={t.id}
                    className="h-64 object-contain" 
                  />
                </div>
                <span className="text-2xl font-medium mt-4">{t.id}</span>
              </button>

              <button
                onClick={() => selectPaymentMethod('FELICA_QUICPAY')}
                className="bg-white border-2 border-gray-200 hover:border-cyan-500 text-gray-800 py-12 px-6 rounded-lg transition-colors flex flex-col items-center justify-between h-96"
              >
                <div className="flex-grow flex items-center justify-center">
                  <img 
                    src="/images/felica-quicpay.png" 
                    alt={t.quicpay}
                    className="h-64 object-contain" 
                  />
                </div>
                <span className="text-2xl font-medium mt-4">{t.quicpay}</span>
              </button>
              
              <button
                onClick={() => selectPaymentMethod('QR_CODE')}
                className="bg-white border-2 border-gray-200 hover:border-purple-500 text-gray-800 py-12 px-6 rounded-lg transition-colors flex flex-col items-center justify-between h-96"
              >
                <div className="flex-grow flex items-center justify-center">
                  <img 
                    src="/images/qr.png" 
                    alt={t.qrCode}
                    className="h-64 object-contain" 
                  />
                </div>
                <span className="text-2xl font-medium mt-4">{t.qrCode}</span>
              </button>
            </div>
            
            <div className="mt-10 text-center">
              <button
                onClick={() => setStatus('ready')}
                className="text-gray-600 hover:text-gray-800 text-xl py-3 px-6"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="w-full bg-white rounded-lg shadow-md p-10 text-center">
            <div className="mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto"></div>
            </div>
            <h2 className="text-3xl font-semibold mb-6">{paymentStatus}</h2>
            <p className="text-gray-600 mb-8 text-xl">
              {paymentMethod === 'CARD_PRESENT' && t.cardInstruction}
              {paymentMethod === 'FELICA_TRANSPORTATION_GROUP' && t.transitInstruction}
              {paymentMethod === 'FELICA_ID' && t.idInstruction}
              {paymentMethod === 'FELICA_QUICPAY' && t.quicpayInstruction}
              {paymentMethod === 'QR_CODE' && t.qrInstruction}
            </p>
          </div>
        )}

        {status === 'complete' && (
          <div className="w-full bg-white rounded-lg shadow-md p-10 text-center">
            <div className="mb-8 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-semibold mb-6">{t.paymentComplete}</h2>
            <p className="text-gray-600 mb-8 text-xl">{t.receiptPrinted}</p>
            <button
              onClick={startNewTransaction}
              className="bg-blue-500 text-white py-5 px-8 rounded-lg hover:bg-blue-600 transition-colors text-2xl font-medium"
            >
              {t.startNewShopping}
            </button>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-[1800px] mx-auto px-4">
          {/* 言語選択 */}
          <div className="flex flex-col items-center">
            <div className="flex gap-3 flex-wrap justify-center">
              {languageOptions.map(option => (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`px-8 py-4 rounded-xl text-xl font-bold transition-all ${
                    language === option.code
                      ? 'bg-blue-600 text-white shadow-lg transform scale-110 border-4 border-white'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500 hover:scale-105'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      {/* ライセンス情報モーダル */}
      {showLicenseInfo && (
        <LicenseScreen
          onClose={() => setShowLicenseInfo(false)}
          translations={t}
        />
      )}
    </div>
  );
};

export default App;
