/**
 * Sistema de Orçamento Profissional - The Office
 * Versão com Catálogo de Produtos
 */
// ===== ESTADO GLOBAL =====
let products = [];
let catalogProducts = [
    {
        id: 1,
        name: "Cadeira Presidente Executiva",
        price: 899.90,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400"
    },
    {
        id: 2,
        name: "Mesa de Escritório L",
        price: 1299.90,
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400"
    },
    {
        id: 3,
        name: "Cadeira Ergonômica",
        price: 649.90,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400"
    },
    {
        id: 4,
        name: "Estante para Arquivos",
        price: 499.90,
        image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400"
    },
    {
        id: 5,
        name: "Armário com Portas",
        price: 799.90,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400"
    },
    {
        id: 6,
        name: "Gaveteiro Móvel",
        price: 349.90,
        image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400"
    }
];
let clientInfo = { name: '', email: '', phone: '', address: '' };
let budgetInfo = {
    number: 'ORC-' + Date.now().toString().slice(-6),
    date: new Date().toISOString().split('T')[0],
    validUntil: getValidUntilDate(),
    discount: 0,
    tax: 0
};
function getValidUntilDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
}
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
}
function openCatalog() {
    document.getElementById('catalogModal').classList.add('active');
}
function closeCatalog() {
    document.getElementById('catalogModal').classList.remove('active');
}
function addCatalogProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const price = parseFloat(document.getElementById('newProductPrice').value) || 0;
    const image = document.getElementById('newProductImage').value.trim();
    if (!name || price <= 0) {
        alert('Preencha nome e preço válidos!');
        return;
    }
    const newProduct = {
        id: Date.now(),
        name,
        price,
        image: image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/%3E%3C/svg%3E'
    };
    catalogProducts.push(newProduct);
    saveCatalogToStorage();
    renderCatalog();
    
    // Limpar formulário
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductPrice').value = '';
    document.getElementById('newProductImage').value = '';
    
    // Exibir código atualizado no console
    console.log('✅ Produto adicionado! Copie o array atualizado abaixo:');
    console.log('catalogProducts = ' + JSON.stringify(catalogProducts, null, 2) + ';');
    
    alert('Produto adicionado ao catálogo com sucesso!');
}
function deleteCatalogProduct(id) {
    if (confirm('Deseja remover este produto do catálogo?')) {
        catalogProducts = catalogProducts.filter(p => p.id !== id);
        saveCatalogToStorage();
        renderCatalog();
        
        // Exibir código atualizado no console
        console.log('🗑️ Produto removido! Array atualizado:');
        console.log('catalogProducts = ' + JSON.stringify(catalogProducts, null, 2) + ';');
    }
}
function addFromCatalog(id) {
    const catalogProduct = catalogProducts.find(p => p.id === id);
    if (!catalogProduct) return;
    const newProduct = {
        id: Date.now(),
        description: catalogProduct.name,
        quantity: 1,
        unitPrice: catalogProduct.price,
        total: catalogProduct.price,
        image: catalogProduct.image
    };
    products.push(newProduct);
    saveProductsToStorage();
    renderProducts();
    calculateTotals();
    closeCatalog();
}
function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    
    if (catalogProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalog">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p style="font-size: 18px; font-weight: 600;">Nenhum produto no catálogo</p>
                <p style="margin-top: 10px;">Adicione produtos usando o formulário acima</p>
            </div>
        `;
        return;
    }
    grid.innerHTML = catalogProducts.map(product => `
        <div class="catalog-item">
            <img src="${product.image}" alt="${product.name}" class="catalog-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; stroke=&quot;currentColor&quot;%3E%3Cpath stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4&quot;/%3E%3C/svg%3E'">
            <div class="catalog-item-info">
                <div class="catalog-item-name">${product.name}</div>
                <div class="catalog-item-price">${formatCurrency(product.price)}</div>
            </div>
            <div class="catalog-item-actions">
                <button class="btn btn-primary btn-sm" onclick="addFromCatalog(${product.id})" style="flex: 1;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Adicionar
                </button>
                <button class="btn btn-icon" onclick="deleteCatalogProduct(${product.id})">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}
// ===== GERENCIAMENTO DE PRODUTOS DO ORÇAMENTO =====
function addCustomProduct() {
    const newProduct = {
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/%3E%3C/svg%3E'
    };
    
    products.push(newProduct);
    saveProductsToStorage();
    renderProducts();
    calculateTotals();
}
function updateProduct(id, field, value) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (field === 'description') {
        product.description = value;
    } else if (field === 'quantity') {
        product.quantity = Math.max(1, parseInt(value) || 1);
        product.total = product.quantity * product.unitPrice;
    } else if (field === 'unitPrice') {
        product.unitPrice = Math.max(0, parseFloat(value) || 0);
        product.total = product.quantity * product.unitPrice;
    } else if (field === 'image') {
        product.image = value || product.image;
    }
    
    saveProductsToStorage();
    renderProducts();
    calculateTotals();
}
function removeProduct(id) {
    if (confirm('Deseja remover este item do orçamento?')) {
        products = products.filter(p => p.id !== id);
        saveProductsToStorage();
        renderProducts();
        calculateTotals();
    }
}
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #64748b;">
                <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 20px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p style="font-size: 16px;">Nenhum item adicionado</p>
                <p style="font-size: 14px; margin-top: 10px;">Clique no botão acima ou abra o catálogo</p>
            </div>
        `;
        return;
    }
    grid.innerHTML = products.map(product => `
        <div class="product-item fade-in">
            <img src="${product.image}" alt="Produto" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; fill=&quot;none&quot; viewBox=&quot;0 0 24 24&quot; stroke=&quot;currentColor&quot;%3E%3Cpath stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4&quot;/%3E%3C/svg%3E'">
            <div class="product-info">
                <div class="form-group" style="margin-bottom: 10px;">
                    <textarea class="form-control" 
                             placeholder="Descrição do produto/serviço"
                             rows="2"
                             onchange="updateProduct(${product.id}, 'description', this.value)">${product.description}</textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 11px;">URL da Imagem (opcional)</label>
                    <input type="url" 
                           class="form-control" 
                           placeholder="https://exemplo.com/imagem.jpg"
                           value="${product.image.startsWith('data:') ? '' : product.image}"
                           onchange="updateProduct(${product.id}, 'image', this.value)"
                           style="font-size: 12px; padding: 8px 12px;">
                </div>
            </div>
            <div class="product-values">
                <div>
                    <label style="font-size: 11px; font-weight: 600; color: #64748b; display: block; margin-bottom: 3px;">Qtd.</label>
                    <input type="number" 
                           class="form-control" 
                           min="1" 
                           value="${product.quantity}"
                           onchange="updateProduct(${product.id}, 'quantity', this.value)">
                </div>
                <div>
                    <label style="font-size: 11px; font-weight: 600; color: #64748b; display: block; margin-bottom: 3px;">Preço Unit.</label>
                    <input type="number" 
                           class="form-control" 
                           min="0" 
                           step="0.01"
                           value="${product.unitPrice}"
                           onchange="updateProduct(${product.id}, 'unitPrice', this.value)">
                </div>
                <div>
                    <label style="font-size: 11px; font-weight: 600; color: #3b82f6; display: block; margin-bottom: 3px;">Total</label>
                    <div class="product-total">${formatCurrency(product.total)}</div>
                </div>
                <button class="btn btn-icon" onclick="removeProduct(${product.id})" style="margin-top: 20px;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}
// ===== CÁLCULOS =====
function calculateTotals() {
    const subtotal = products.reduce((sum, product) => sum + product.total, 0);
    const discountAmount = (subtotal * budgetInfo.discount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * budgetInfo.tax) / 100;
    const total = subtotalAfterDiscount + taxAmount;
    updateTotalsDisplay({ subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total });
    return { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total };
}
function updateTotalsDisplay(totals) {
    const subtotalEl = document.getElementById('subtotal');
    const discountRow = document.getElementById('discountRow');
    const discountLabel = document.getElementById('discountLabel');
    const discountAmount = document.getElementById('discountAmount');
    const taxRow = document.getElementById('taxRow');
    const taxLabel = document.getElementById('taxLabel');
    const taxAmount = document.getElementById('taxAmount');
    const totalAmount = document.getElementById('totalAmount');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    
    if (budgetInfo.discount > 0) {
        if (discountRow) discountRow.style.display = 'flex';
        if (discountLabel) discountLabel.textContent = `Desconto (${budgetInfo.discount}%):`;
        if (discountAmount) discountAmount.textContent = `- ${formatCurrency(totals.discountAmount)}`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
    if (budgetInfo.tax > 0) {
        if (taxRow) taxRow.style.display = 'flex';
        if (taxLabel) taxLabel.textContent = `Impostos (${budgetInfo.tax}%):`;
        if (taxAmount) taxAmount.textContent = formatCurrency(totals.taxAmount);
    } else {
        if (taxRow) taxRow.style.display = 'none';
    }
    if (totalAmount) totalAmount.textContent = formatCurrency(totals.total);
}
// ===== ARMAZENAMENTO LOCAL =====
function saveCatalogToStorage() {
    try {
        localStorage.setItem('theOfficeCatalog', JSON.stringify(catalogProducts));
        console.log('💾 Catálogo salvo com sucesso!');
    } catch (e) {
        console.error('Erro ao salvar catálogo:', e);
    }
}
function loadCatalogFromStorage() {
    try {
        const saved = localStorage.getItem('theOfficeCatalog');
        if (saved) {
            const loadedProducts = JSON.parse(saved);
            // Mesclar produtos salvos com produtos padrão, evitando duplicatas
            const existingIds = loadedProducts.map(p => p.id);
            const defaultProducts = catalogProducts.filter(p => !existingIds.includes(p.id));
            catalogProducts = [...loadedProducts, ...defaultProducts];
            console.log('✅ Catálogo carregado:', catalogProducts.length, 'produtos');
        } else {
            // Se não há nada salvo, salvar os produtos padrão
            saveCatalogToStorage();
        }
    } catch (e) {
        console.error('Erro ao carregar catálogo:', e);
    }
}
// ===== GERAÇÃO DE PDF =====
const pdfStyles = `
    /* Resets e Configurações Base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 15mm 20mm; }
    body { 
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
        color: #2b2b2b; 
        line-height: 1.5; 
        background-color: #ffffff;
    }
    
    /* Layout Principal */
    .document-container { max-width: 100%; margin: 0 auto; }
    
    /* Cabeçalho */
    .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        border-bottom: 2px solid #1a365d; 
        padding-bottom: 25px; 
        margin-bottom: 35px; 
    }
    
    /* Logotipo Moderno */
    .logo-container { display: flex; align-items: center; gap: 15px; }
    .logo-box {
        background-color: #1a365d;
        color: #ffffff;
        padding: 12px 18px;
        border-radius: 6px;
        text-align: center;
    }
    .logo-box .the { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; }
    .logo-box .office { font-size: 20px; font-weight: 800; }
    .company-details { font-size: 12px; color: #4a5568; line-height: 1.6; }
    
    /* Informação do Documento (Direita) */
    .doc-info { text-align: right; }
    .doc-info h1 { font-size: 32px; color: #1a365d; font-weight: 800; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
    .doc-info .ref { font-size: 15px; font-weight: bold; color: #4a5568; }
    .doc-info .date { font-size: 12px; margin-top: 6px; color: #718096; }
    
    /* Secção de Dados (Cliente e Orçamento) */
    .info-section { display: flex; gap: 30px; margin-bottom: 40px; }
    .info-box { flex: 1; }
    .info-box.highlight { background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #edf2f7; }
    
    .info-box h2 { 
        font-size: 12px; 
        text-transform: uppercase; 
        color: #a0aec0; 
        letter-spacing: 1px; 
        margin-bottom: 12px; 
        border-bottom: 1px solid #edf2f7; 
        padding-bottom: 6px; 
    }
    .info-box p { font-size: 13px; margin-bottom: 6px; }
    .info-box strong { font-weight: 600; color: #2d3748; display: inline-block; width: 95px; }
    
    /* Tabela de Produtos */
    .table-container { margin-bottom: 35px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { 
        background-color: #f8fafc; 
        color: #4a5568; 
        font-size: 11px; 
        text-transform: uppercase; 
        letter-spacing: 1px; 
        padding: 14px 12px; 
        text-align: left; 
        border-bottom: 2px solid #cbd5e0;
    }
    tbody td { 
        padding: 14px 12px; 
        font-size: 13px; 
        border-bottom: 1px solid #edf2f7; 
        vertical-align: middle;
    }
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    
    /* Produto Individual */
    .product-cell { display: flex; align-items: center; gap: 15px; }
    .prod-img { width: 45px; height: 45px; border-radius: 6px; object-fit: cover; border: 1px solid #e2e8f0; background: #fff; }
    .prod-name { font-weight: 600; color: #2d3748; }
    
    /* Resumo Financeiro */
    .totals-section { display: flex; justify-content: flex-end; margin-bottom: 50px; }
    .totals-box { width: 360px; background-color: #f8fafc; border-radius: 8px; padding: 25px; border: 1px solid #edf2f7; }
    .total-line { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #4a5568; }
    .total-line.discount { color: #e53e3e; }
    .total-line.tax { color: #dd6b20; }
    .total-line.final { 
        margin-top: 18px; 
        padding-top: 18px; 
        border-top: 2px solid #cbd5e0; 
        font-size: 20px; 
        font-weight: 800; 
        color: #1a365d; 
    }
    
    /* Rodapé / Termos */
    .footer { 
        padding-top: 25px; 
        border-top: 1px solid #edf2f7; 
        font-size: 11px; 
        color: #718096; 
        text-align: center; 
        line-height: 1.6;
    }
    .footer-highlight { font-weight: bold; color: #4a5568; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
`;
function getPdfHtmlTemplate(budgetInfo, clientInfo, products, totals) {
    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <title>Orçamento #${budgetInfo.number}</title>
        <style>${pdfStyles}</style>
    </head>
    <body>
        <div class="document-container">
            <div class="header">
                <div class="logo-container">
                    <div class="logo-box">
                        <div class="the">The</div>
                        <div class="office">Office</div>
                    </div>
                    <div class="company-details">
                        <strong>The Office - Soluções em Mobiliário</strong><br>
                        Rua do Comércio, 123<br>
                        contacto@theoffice.pt | +351 900 000 000
                    </div>
                </div>
                <div class="doc-info">
                    <h1>Orçamento</h1>
                    <div class="ref">Referência #${budgetInfo.number}</div>
                    <div class="date">Emitido a: ${formatDate(budgetInfo.date)}</div>
                </div>
            </div>
            <div class="info-section">
                <div class="info-box">
                    <h2>Preparado Para</h2>
                    <p><strong>Cliente:</strong> ${clientInfo.name || 'Não informado'}</p>
                    <p><strong>E-mail:</strong> ${clientInfo.email || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${clientInfo.phone || 'Não informado'}</p>
                    <p><strong>Endereço:</strong> ${clientInfo.address || 'Não informado'}</p>
                </div>
                <div class="info-box highlight">
                    <h2>Detalhes da Proposta</h2>
                    <p><strong>Nº Orçamento:</strong> ${budgetInfo.number}</p>
                    <p><strong>Data de Emissão:</strong> ${formatDate(budgetInfo.date)}</p>
                    <p><strong>Válido Até:</strong> ${formatDate(budgetInfo.validUntil)}</p>
                    <p><strong>Moeda:</strong> EUR (€)</p>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%;">Descrição do Artigo</th>
                            <th class="text-center">Quantidade</th>
                            <th class="text-right">Preço Unitário</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>
                                    <div class="product-cell">
                                        <img src="${product.image}" class="prod-img" onerror="this.style.display='none'">
                                        <span class="prod-name">${product.description || 'Artigo sem descrição'}</span>
                                    </div>
                                </td>
                                <td class="text-center">${product.quantity}</td>
                                <td class="text-right">${formatCurrency(product.unitPrice)}</td>
                                <td class="text-right" style="font-weight: 600; color: #2d3748;">${formatCurrency(product.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="totals-section">
                <div class="totals-box">
                    <div class="total-line">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(totals.subtotal)}</span>
                    </div>
                    ${budgetInfo.discount > 0 ? `
                        <div class="total-line discount">
                            <span>Desconto (${budgetInfo.discount}%):</span>
                            <span>- ${formatCurrency(totals.discountAmount)}</span>
                        </div>
                    ` : ''}
                    ${budgetInfo.tax > 0 ? `
                        <div class="total-line tax">
                            <span>Impostos (${budgetInfo.tax}%):</span>
                            <span>+ ${formatCurrency(totals.taxAmount)}</span>
                        </div>
                    ` : ''}
                    <div class="total-line final">
                        <span>TOTAL A PAGAR:</span>
                        <span>${formatCurrency(totals.total)}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p class="footer-highlight">Termos & Condições de Fornecimento</p>
                <p>Este orçamento é válido até <strong>${formatDate(budgetInfo.validUntil)}</strong>. Os valores apresentados já contêm todas as taxas devidas.</p>
                <p>A adjudicação da proposta requer um sinal acordado entre as partes, com o remanescente a ser liquidado contra a entrega.</p>
                <p>O prazo de entrega será estabelecido após a aprovação da proposta. Todos os artigos estão cobertos pela garantia do fabricante.</p>
                <p style="margin-top: 15px;">Obrigado por preferir a <strong>The Office</strong>!</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
// ===== GERAÇÃO DE PDF =====
function generatePDF() {
    exportarParaExcel(); 
    const totals = calculateTotals();
    const html = getPdfHtmlTemplate(budgetInfo, clientInfo, products, totals);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    } else {
        alert("Por favor, permita pop-ups para gerar o PDF.");
    }
}
// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Campos do cliente
    document.getElementById('clientName').oninput = (e) => clientInfo.name = e.target.value;
    document.getElementById('clientEmail').oninput = (e) => clientInfo.email = e.target.value.trim();
    document.getElementById('clientPhone').oninput = (e) => clientInfo.phone = e.target.value;
    document.getElementById('clientAddress').oninput = (e) => clientInfo.address = e.target.value;
    // Campos do orçamento
    document.getElementById('budgetNumber').value = budgetInfo.number;
    document.getElementById('budgetNumber').oninput = (e) => budgetInfo.number = e.target.value;
    
    document.getElementById('budgetDate').value = budgetInfo.date;
    document.getElementById('budgetDate').oninput = (e) => budgetInfo.date = e.target.value;
    
    document.getElementById('budgetValidUntil').value = budgetInfo.validUntil;
    document.getElementById('budgetValidUntil').oninput = (e) => budgetInfo.validUntil = e.target.value;
    
    document.getElementById('budgetDiscount').oninput = (e) => {
        budgetInfo.discount = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
        calculateTotals();
    };
    
    document.getElementById('budgetTax').oninput = (e) => {
        budgetInfo.tax = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
        calculateTotals();
    };
    // Máscara de data automática para Data
    const budgetDateInput = document.getElementById('budgetDate');
    budgetDateInput.type = 'text';
    budgetDateInput.placeholder = 'DD/MM/AAAA';
    budgetDateInput.maxLength = 10;
    budgetDateInput.value = formatDateInput(budgetInfo.date);
    
    budgetDateInput.oninput = (e) => {
        e.target.value = maskDate(e.target.value);
        budgetInfo.date = convertToISODate(e.target.value);
    };
    // Máscara de data automática para Válido até
    const budgetValidUntilInput = document.getElementById('budgetValidUntil');
    budgetValidUntilInput.type = 'text';
    budgetValidUntilInput.placeholder = 'DD/MM/AAAA';
    budgetValidUntilInput.maxLength = 10;
    budgetValidUntilInput.value = formatDateInput(budgetInfo.validUntil);
    
    budgetValidUntilInput.oninput = (e) => {
        e.target.value = maskDate(e.target.value);
        budgetInfo.validUntil = convertToISODate(e.target.value);
    };
}
// ===== FUNÇÕES DE MÁSCARA DE DATA =====
function maskDate(value) {
    // Remove tudo que não é número
    value = value.replace(/\D/g, '');
    
    // Adiciona as barras automaticamente
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
        value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    return value;
}
function formatDateInput(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}
function convertToISODate(maskedDate) {
    if (!maskedDate || maskedDate.length < 10) return '';
    const [day, month, year] = maskedDate.split('/');
    if (!day || !month || !year || year.length < 4) return '';
    return `${year}-${month}-${day}`;
}
// ===== INICIALIZAÇÃO =====
function init() {
    loadCatalogFromStorage();
    loadProductsFromStorage();
    setupEventListeners();
    renderProducts();
    renderCatalog();
    calculateTotals();
    console.log('✅ Sistema de Orçamento carregado com sucesso!');
}
// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Salva os itens do orçamento no localStorage 
function saveProductsToStorage() {
    try {
        localStorage.setItem('theOfficeProducts', JSON.stringify(products));
    } catch (e) {
        console.error('Erro ao salvar produtos:', e);
    }
}
// Carrega os itens do orçamento do localStorage
function loadProductsFromStorage() {
    try {
        const savedProducts = localStorage.getItem('theOfficeProducts');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        }
    } catch (e) {
        console.error('Erro ao carregar produtos:', e);
    }
}
// ===== EXPORTAR PARA EXCEL (CSV) =====
function exportarParaExcel() {
    if (products.length === 0) {
        alert("O orçamento está vazio. Adicione produtos antes de exportar.");
        return;
    }
    // O BOM (\uFEFF) é obrigatório para o Excel ler acentos em UTF-8 corretamente
    let csv = "\uFEFF"; 
    
    // Título
    csv += "ORÇAMENTO - THE OFFICE\n\n";
    // Dados do Cliente
    if (clientInfo) {
        csv += "DADOS DO CLIENTE\n";
        csv += `Nome:;${clientInfo.name || 'Não informado'}\n`;
        csv += `Email:;${clientInfo.email || 'Não informado'}\n`;
        csv += `Telefone:;${clientInfo.phone || 'Não informado'}\n`;
        csv += `Morada:;${clientInfo.address || 'Não informada'}\n\n`;
    }
    // Cabeçalho da Tabela de Produtos
    csv += "Item;Descrição;Quantidade;Preço Unitário;Total\n";
    // Preencher Produtos
    products.forEach((p, index) => {
        // Limpar possíveis ponto e vírgulas da descrição para não quebrar o Excel
        const desc = p.description ? p.description.replace(/;/g, ',') : '';
        // Formatar para o Excel reconhecer como número (trocar ponto por vírgula)
        const precoFormatado = p.unitPrice.toFixed(2).replace('.', ',');
        const totalFormatado = p.total.toFixed(2).replace('.', ',');
        
        csv += `${index + 1};${desc};${p.quantity};${precoFormatado};${totalFormatado}\n`;
    });
    csv += "\n";
    // Calcular Totais
    const totais = calculateTotals();
    
    csv += `;;;SUBTOTAL:;${totais.subtotal.toFixed(2).replace('.', ',')}\n`;
    
    if (budgetInfo && budgetInfo.discount > 0) {
        csv += `;;;DESCONTO (${budgetInfo.discount}%):;- ${totais.discountAmount.toFixed(2).replace('.', ',')}\n`;
    }
    
    if (budgetInfo && budgetInfo.tax > 0) {
        csv += `;;;IMPOSTO (${budgetInfo.tax}%):;${totais.taxAmount.toFixed(2).replace('.', ',')}\n`;
    }
    csv += `;;;TOTAL FINAL:;${totais.total.toFixed(2).replace('.', ',')}\n\n`;
    const dataAtual = budgetInfo ? formatDateInput(budgetInfo.date) : new Date().toLocaleDateString('pt-PT');
    csv += `Data do orçamento:;${dataAtual}\n`;
    // Criar o ficheiro virtual (Blob)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const nomeClienteFormatado = clientInfo.name ? clientInfo.name.replace(/[^a-z0-9]/gi, '_') : 'Geral';
    link.href = url;
    link.download = `Orcamento_${nomeClienteFormatado}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// Expor funções globalmente para event handlers inline
window.openCatalog = openCatalog;
window.closeCatalog = closeCatalog;
window.addCatalogProduct = addCatalogProduct;
window.deleteCatalogProduct = deleteCatalogProduct;
window.addFromCatalog = addFromCatalog;
window.addCustomProduct = addCustomProduct;
window.updateProduct = updateProduct;
window.removeProduct = removeProduct;
window.generatePDF = generatePDF;
window.exportarParaExcel = exportarParaExcel;