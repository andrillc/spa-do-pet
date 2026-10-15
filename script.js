'use strict';

/* ===== Utilidades ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ini = n => n.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const iso = d => new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const hoje = (n = 0) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M17 4a4 4 0 0 1 0 8M22 21v-1a5 5 0 0 0-4-5"/>',
  paw: '<circle cx="6" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="15" cy="5.5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M12.5 12c-3 0-6 3-6 5.5 0 1.7 1.5 2.5 3 2.5 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.5 0 3-.8 3-2.5 0-2.5-3-5.5-6-5.5z"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  user: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  undo: '<path d="M3 7v6h6M3 13a9 9 0 1 0 3-7"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
$$('[data-ic]').forEach(el => el.innerHTML = ic(el.dataset.ic));

let tt;
const toast = m => {
  const t = $('#toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
};

/* ===== Dados (salvos no navegador) ===== */
const KEY = 'pelo:dados3', SESS = 'pelo:sessao';
const PROFS = ['Camila', 'Rafael', 'Juliana'], FORMAS = ['Pix', 'Cartão', 'Dinheiro'];
const dBR = d => d.split('-').reverse().join('/');
const seed = () => ({
  seq: 100,
  clientes: [
    { id: 1, nome: 'Thiago Almeida', tel: '(21) 98888-1111', email: 'thiago@email.com', desde: '2023-03-12' },
    { id: 2, nome: 'Amanda Moreira', tel: '(21) 97777-2222', email: 'amanda@email.com', desde: '2024-01-20' },
    { id: 3, nome: 'Beatriz Esteves', tel: '(21) 96666-3333', email: 'bia@email.com', desde: '2025-06-05' }],
  animais: [
    { id: 1, nome: 'Thor', especie: 'Cão', raca: 'Golden Retriever', idade: 4, clienteId: 1 },
    { id: 2, nome: 'Mel', especie: 'Gato', raca: 'Siamês', idade: 2, clienteId: 2 },
    { id: 3, nome: 'Bento', especie: 'Cão', raca: 'Shih Tzu', idade: 6, clienteId: 3 }],
  servicos: [
    { id: 1, nome: 'Banho', preco: 60, min: 45 },
    { id: 2, nome: 'Tosa higiênica', preco: 50, min: 30 },
    { id: 3, nome: 'Banho e tosa', preco: 110, min: 90 }],
  agenda: [
    { id: 1, data: hoje(), hora: '09:00', animalId: 1, servicoId: 3, prof: 'Camila', status: 'agendado', pago: 'pendente' },
    { id: 2, data: hoje(), hora: '11:00', animalId: 2, servicoId: 1, prof: 'Rafael', status: 'agendado', pago: 'pendente' },
    { id: 3, data: hoje(1), hora: '14:30', animalId: 3, servicoId: 2, prof: 'Juliana', status: 'agendado', pago: 'pendente' },
    { id: 4, data: hoje(-3), hora: '10:00', animalId: 1, servicoId: 1, prof: 'Camila', status: 'concluido', pago: 'pago', forma: 'Pix' },
    { id: 5, data: hoje(-7), hora: '15:00', animalId: 2, servicoId: 2, prof: 'Rafael', status: 'concluido', pago: 'pago', forma: 'Cartão' },
    { id: 6, data: hoje(-10), hora: '09:30', animalId: 3, servicoId: 1, prof: 'Juliana', status: 'concluido', pago: 'pendente' },
    { id: 7, data: hoje(-20), hora: '16:00', animalId: 1, servicoId: 3, prof: 'Camila', status: 'concluido', pago: 'pago', forma: 'Dinheiro' }],
  vacinas: [
    { id: 1, animalId: 1, vacina: 'V10', proxima: hoje(12) },
    { id: 2, animalId: 2, vacina: 'Antirrábica', proxima: hoje(-5) },
    { id: 3, animalId: 3, vacina: 'V10', proxima: hoje(200) }]
});
let db = null;
try { db = JSON.parse(localStorage.getItem(KEY)); } catch { }
if (!db || !['clientes', 'animais', 'servicos', 'agenda', 'vacinas'].every(k => Array.isArray(db[k]))) db = seed();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { } };
const nid = () => ++db.seq;
save(); // grava os exemplos iniciais na primeira abertura
const by = (l, id) => db[l].find(x => x.id == id);

/* ===== Sessão ===== */
const getSess = () => { try { return localStorage.getItem(SESS) || sessionStorage.getItem(SESS); } catch { return null; } };
const setSess = (em, keep) => { try { (keep ? localStorage : sessionStorage).setItem(SESS, em); } catch { } };
const clrSess = () => { try { localStorage.removeItem(SESS); sessionStorage.removeItem(SESS); } catch { } };

/* ===== Modal genérico ===== */
function form(titulo, campos, valores, onSave, ok = 'Salvar') {
  $('#dlgT').textContent = titulo;
  $('#dlgOk').textContent = ok;
  $('#dlgB').innerHTML = campos.map(c => `<label class="lbl">${c.l}${c.o
    ? `<select name="${c.n}">${c.o.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`
    : `<input name="${c.n}" type="${c.t || 'text'}" ${c.s ? `step="${c.s}" min="0"` : ''} ${c.p ? `placeholder="${esc(c.p)}"` : ''}>`}<small class="err"></small></label>`).join('')
    + '<small class="err" id="dlgErr"></small>';
  const f = $('#dlgForm'); f.noValidate = true;
  campos.forEach(c => {
    const el = f.elements[c.n]; el.value = valores?.[c.n] ?? c.d ?? '';
    if (c.m) { el.value = c.m(el.value); el.addEventListener('input', () => { el.value = c.m(el.value); }); }
  });
  f.onsubmit = e => {
    e.preventDefault();
    const v = {}; let valido = true;
    campos.forEach(c => {
      const el = f.elements[c.n]; v[c.n] = el.value.trim();
      const m = !v[c.n] ? (c.r ? 'Preencha este campo.' : '') : (c.v ? c.v(v[c.n]) : '');
      el.closest('.lbl').querySelector('.err').textContent = m;
      if (m) valido = false;
    });
    $('#dlgErr').textContent = '';
    if (!valido) return;
    const erro = onSave(v);
    if (erro) { $('#dlgErr').textContent = erro; return; }
    $('#dlg').close();
  };
  $('#dlg').showModal();
}
$('#dlgC').onclick = () => $('#dlg').close();

/* ===== Entidades ===== */
let view = 'painel', dia = hoje(), q = '';
const ESP = [['Cão', 'Cão'], ['Gato', 'Gato'], ['Outro', 'Outro']];
const digitos = t => String(t).replace(/\D/g, '');
const maskTel = t => {
  const d = digitos(t).slice(0, 11), k = d.length > 10 ? 7 : 6;
  return d.length > k ? `(${d.slice(0, 2)}) ${d.slice(2, k)}-${d.slice(k)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
};
const vNome = v => v.length < 2 ? 'Informe pelo menos 2 caracteres.' : '';
const vTel = v => /^\d{10,11}$/.test(digitos(v)) ? '' : 'Informe DDD e número, como (21) 98888-1111.';
const vMail = v => /^\S+@\S+\.\S+$/.test(v) ? '' : 'Informe um e-mail válido.';
const vIdade = v => /^\d+$/.test(v) && v <= 30 ? '' : 'Informe a idade em anos, de 0 a 30.';
const vPreco = v => v > 0 && v <= 5000 ? '' : 'Informe um valor entre R$ 0,01 e R$ 5.000.';
const vMin = v => v >= 5 && v <= 480 ? '' : 'Informe de 5 a 480 minutos.';
const vPassado = v => v > hoje() ? 'A data não pode ser futura.' : '';
const igual = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
const animalOpts = () => db.animais.map(a => [a.id, `${a.nome} (${by('clientes', a.clienteId)?.nome || 's/ tutor'})`]);
const PET = [
  { n: 'petNome', l: 'Nome do pet (opcional)' },
  { n: 'petEspecie', l: 'Espécie do pet', o: ESP },
  { n: 'petRaca', l: 'Raça do pet' },
  { n: 'petIdade', l: 'Idade do pet (anos)', t: 'number', s: '1', v: vIdade }];

const E = {
  clientes: { nome: 'tutor', campos: () => [
    { n: 'nome', l: 'Nome', r: 1, v: vNome },
    { n: 'tel', l: 'Telefone', t: 'tel', r: 1, v: vTel, m: maskTel, p: '(21) 98888-1111' },
    { n: 'email', l: 'E-mail', t: 'email', v: vMail },
    { n: 'desde', l: 'Tutor desde', t: 'date', r: 1, d: hoje(), v: vPassado }],
    dup: (v, it) => db.clientes.some(c => c !== it && digitos(c.tel) === digitos(v.tel)) ? 'Já existe um tutor com este telefone.'
      : (v.petNome && v.petIdade === '' ? 'Informe a idade do pet.' : '') },
  animais: { nome: 'animal', campos: () => [
    { n: 'nome', l: 'Nome', r: 1, v: vNome },
    { n: 'especie', l: 'Espécie', o: ESP },
    { n: 'raca', l: 'Raça' },
    { n: 'idade', l: 'Idade (anos)', t: 'number', s: '1', r: 1, v: vIdade },
    { n: 'clienteId', l: 'Tutor', r: 1, o: db.clientes.map(c => [c.id, c.nome]) }],
    dup: (v, it) => db.animais.some(a => a !== it && a.clienteId == v.clienteId && igual(a.nome, v.nome)) ? 'Este tutor já tem um animal com esse nome.' : '' },
  servicos: { nome: 'serviço', campos: () => [
    { n: 'nome', l: 'Nome do serviço', r: 1, v: vNome },
    { n: 'preco', l: 'Preço (R$)', t: 'number', s: '0.01', r: 1, v: vPreco },
    { n: 'min', l: 'Duração (minutos)', t: 'number', s: '5', r: 1, v: vMin }],
    dup: (v, it) => db.servicos.some(x => x !== it && igual(x.nome, v.nome)) ? 'Já existe um serviço com esse nome.' : '' },
  agenda: { nome: 'agendamento', campos: () => [
    { n: 'data', l: 'Data', t: 'date', r: 1, d: dia < hoje() ? hoje() : dia },
    { n: 'hora', l: 'Hora', t: 'time', r: 1 },
    { n: 'animalId', l: 'Animal', r: 1, o: animalOpts() },
    { n: 'servicoId', l: 'Serviço', r: 1, o: db.servicos.map(s => [s.id, `${s.nome} – ${brl(s.preco)}`]) },
    { n: 'prof', l: 'Profissional', o: PROFS.map(p => [p, p]) }],
    dup: (v, it) => {
      if (v.data < hoje() && (!it || (it.status === 'agendado' && it.data !== v.data))) return 'Escolha hoje ou uma data futura.';
      const mesmos = db.agenda.filter(a => a !== it && a.status !== 'cancelado' && a.data === v.data && a.hora === v.hora);
      if (mesmos.some(a => a.animalId == v.animalId)) return 'Este animal já tem atendimento neste horário.';
      if (mesmos.some(a => a.prof === v.prof)) return `${v.prof} já tem atendimento neste horário.`;
      return '';
    } },
  vacinas: { nome: 'vacina', campos: () => [
    { n: 'animalId', l: 'Animal', r: 1, o: animalOpts() },
    { n: 'vacina', l: 'Vacina (declarada pelo tutor)', r: 1, v: vNome },
    { n: 'proxima', l: 'Próxima dose', t: 'date', r: 1 }],
    dup: (v, it) => db.vacinas.some(x => x !== it && x.animalId == v.animalId && igual(x.vacina, v.vacina) && x.proxima === v.proxima) ? 'Esta vacina já está registrada para este animal e data.' : '' }
};

function abrir(ent, item) {
  const e = E[ent]; let campos = e.campos();
  const falta = campos.find(c => c.o && !c.o.length);
  if (falta) {
    const dest = { clienteId: 'clientes', animalId: 'animais', servicoId: 'servicos' }[falta.n];
    toast(`Cadastre primeiro ${{ clientes: 'um tutor', animais: 'um animal', servicos: 'um serviço' }[dest]}.`);
    return abrir(dest);
  }
  const novoTutor = ent === 'clientes' && !item;
  if (novoTutor) campos = campos.concat(PET);
  form(`${item ? 'Editar' : 'Novo'} ${e.nome}${novoTutor ? ' e pet' : ''}`, campos, item, v => {
    const erro = e.dup ? e.dup(v, item) : '';
    if (erro) return erro;
    let pet = null;
    if (novoTutor) {
      if (v.petNome) pet = { nome: v.petNome, especie: v.petEspecie, raca: v.petRaca, idade: Number(v.petIdade) };
      ['petNome', 'petEspecie', 'petRaca', 'petIdade'].forEach(k => delete v[k]);
    }
    ['clienteId', 'animalId', 'servicoId', 'preco', 'min', 'idade'].forEach(k => { if (k in v) v[k] = Number(v[k]); });
    let reg = item;
    if (item) Object.assign(item, v);
    else { reg = { id: nid(), ...(ent === 'agenda' ? { status: 'agendado', pago: 'pendente' } : {}), ...v }; db[ent].push(reg); }
    if (pet) db.animais.push({ id: nid(), ...pet, clienteId: reg.id });
    save(); render(); toast(pet ? 'Tutor e pet cadastrados' : 'Salvo com sucesso');
  });
}

function apagar(ent, id) {
  const ids = ent === 'clientes' ? db.animais.filter(a => a.clienteId == id).map(a => a.id) : ent === 'animais' ? [Number(id)] : [];
  const nAg = db.agenda.filter(a => ent === 'servicos' ? a.servicoId == id : ids.includes(a.animalId)).length;
  const nVac = db.vacinas.filter(v => ids.includes(v.animalId)).length;
  const extra = [ent === 'clientes' && ids.length && `${ids.length} animal(is)`, nAg && `${nAg} agendamento(s)`, nVac && `${nVac} vacina(s)`].filter(Boolean).join(', ');
  if (!confirm(`Excluir este registro?${extra ? ` Isso também exclui: ${extra}.` : ''} Esta ação não pode ser desfeita.`)) return;
  if (ent === 'clientes') db.animais = db.animais.filter(a => !ids.includes(a.id));
  if (ent === 'servicos') db.agenda = db.agenda.filter(a => a.servicoId != id);
  else { db.agenda = db.agenda.filter(a => !ids.includes(a.animalId)); db.vacinas = db.vacinas.filter(v => !ids.includes(v.animalId)); }
  db[ent] = db[ent].filter(x => x.id != id);
  save(); render(); toast('Registro excluído');
}

/* ===== Telas ===== */
const ST = { agendado: 'Agendado', concluido: 'Concluído', cancelado: 'Cancelado' };
const vazio = '<p class="empty">Nada por aqui ainda. Use “Novo” para adicionar.</p>';
const tag = (c, t) => `<span class="tag ${c}">${esc(t)}</span>`;
const acts = (ent, id, extra = '') => `<div class="acts">${extra}
  <button class="icon" data-a="edit" data-e="${ent}" data-id="${id}" aria-label="Editar" title="Editar">${ic('edit')}</button>
  <button class="icon danger" data-a="del" data-e="${ent}" data-id="${id}" aria-label="Excluir" title="Excluir">${ic('trash')}</button></div>`;
const vst = v => {
  if (v.aplicada) return ['concluido', 'Aplicada'];
  const n = Math.round((new Date(v.proxima + 'T12:00') - new Date(hoje() + 'T12:00')) / 864e5);
  return n < 0 ? ['cancelado', 'Atrasada'] : n <= 30 ? ['agendado', n === 0 ? 'Vence hoje' : `Vence em ${n} dias`] : ['concluido', 'Em dia'];
};
const petVac = id => {
  const l = db.vacinas.filter(v => v.animalId == id);
  if (!l.length) return ['', 'Sem vacinas registradas'];
  const p = l.filter(v => !v.aplicada).map(v => vst(v)[0]);
  return p.includes('cancelado') ? ['cancelado', 'Vacina atrasada'] : p.includes('agendado') ? ['agendado', 'Dose próxima'] : ['concluido', 'Vacinas em dia'];
};
const chk = v => `<input type="checkbox" class="chk" data-a="vac" data-e="vacinas" data-id="${v.id}" ${v.aplicada ? 'checked' : ''}
  aria-label="Marcar ${esc(v.vacina)} de ${esc(by('animais', v.animalId)?.nome || '')} como aplicada">`;
const valor = a => by('servicos', a.servicoId)?.preco || 0;
const nomeAn = a => by('animais', a.animalId)?.nome || '—';
const nomeSv = a => by('servicos', a.servicoId)?.nome || '—';
const ord = (x, y) => (x.data + x.hora).localeCompare(y.data + y.hora);
const doDia = d => db.agenda.filter(a => a.data === d).sort(ord);
const match = (...t) => t.join(' ').toLowerCase().includes(q);
const tabela = (cab, linhas) => linhas.length ? `<div class="tbl"><table><thead><tr>${cab.map(c => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${linhas.map(l => `<tr>${l.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : vazio;
const stats = l => `<div class="stats">${l.map(([t, v, c, go, sub]) => {
  const i = `<b class="${c || ''}">${v}</b><span>${t}</span>${sub ? `<small>${sub}</small>` : ''}`;
  return go ? `<button class="stat" data-a="ir" data-v="${go}">${i}</button>` : `<div class="stat">${i}</div>`;
}).join('')}</div>`;

const lista = (ag, comData) => ag.length ? `<ul class="list">${ag.map(a => {
  const extra = a.status === 'agendado'
    ? `<button class="icon" data-a="ok" data-e="agenda" data-id="${a.id}" aria-label="Concluir" title="Concluir">${ic('check')}</button>
       <button class="icon" data-a="cancel" data-e="agenda" data-id="${a.id}" aria-label="Cancelar" title="Cancelar">${ic('x')}</button>`
    : `<button class="icon" data-a="reabrir" data-e="agenda" data-id="${a.id}" aria-label="Reabrir" title="Reabrir">${ic('undo')}</button>`;
  return `<li class="item"><time>${esc(a.hora)}${comData ? `<small>${dBR(a.data)}</small>` : ''}</time>
    <div class="grow"><b>${esc(nomeAn(a))}</b><small>${esc(nomeSv(a))} com ${esc(a.prof || '—')}</small></div>
    ${tag(a.status, ST[a.status])}${acts('agenda', a.id, extra)}</li>`;
}).join('')}</ul>` : '<p class="empty">Nenhum atendimento neste dia. Use “Novo” para agendar.</p>';

const R = {
  painel() {
    const ag = doDia(hoje()), pend = ag.filter(a => a.status === 'agendado').length;
    const prox = db.agenda.filter(a => a.status === 'agendado' && a.data >= hoje()).sort(ord).slice(0, 5);
    const al = db.vacinas.filter(v => vst(v)[0] !== 'concluido').sort((x, y) => x.proxima.localeCompare(y.proxima));
    return `<div class="quick">
      <button class="btn primary" data-a="novo" data-e="agenda">${ic('plus')}Agendamento</button>
      <button class="btn ghost" data-a="novo" data-e="clientes">${ic('plus')}Tutor e pet</button>
      <button class="btn ghost" data-a="novo" data-e="animais">${ic('plus')}Animal</button>
      <button class="btn ghost" data-a="novo" data-e="vacinas">${ic('plus')}Vacina</button></div>` +
      stats([['Atendimentos pendentes hoje', pend, '', 'agenda', `${ag.length} no dia`], ['Animais cadastrados', db.animais.length, '', 'animais'],
        ['Tutores', db.clientes.length, '', 'clientes'], ['Alertas de vacinação', al.length, '', 'vacinas']]) +
      `<div class="cols"><div><div class="sh"><h3 class="sec">Próximos atendimentos</h3><button class="link" data-a="ir" data-v="agenda">Ver agenda</button></div>${lista(prox, 1)}</div>
       <div><div class="sh"><h3 class="sec">Alertas de vacinação</h3><button class="link" data-a="ir" data-v="vacinas">Ver vacinação</button></div>
       ${al.length ? `<ul class="list">${al.map(v => {
        const [c, t] = vst(v);
        return `<li class="item">${chk(v)}<div class="grow"><b>${esc(nomeAn(v))}</b><small>${esc(v.vacina)}, dose em ${dBR(v.proxima)}</small></div>${tag(c, t)}</li>`;
      }).join('')}</ul>` : '<p class="empty">Nenhuma vacina atrasada ou perto do prazo.</p>'}</div></div>`;
  },
  agenda() {
    return `<div class="datebar"><button class="icon" data-a="prev" aria-label="Dia anterior" style="transform:scaleX(-1)">${ic('chev')}</button>
      <input type="date" id="dia" value="${dia}" aria-label="Data">
      <button class="icon" data-a="next" aria-label="Próximo dia">${ic('chev')}</button>
      <button class="btn ghost" data-a="hoje">Hoje</button></div>${lista(doDia(dia))}`;
  },
  animais() {
    const l = db.animais.filter(a => match(a.nome, a.raca, a.especie, by('clientes', a.clienteId)?.nome));
    return l.length ? `<div class="grid">${l.map(a => `<article class="card"><span class="av c${a.id % 3}">${esc(ini(a.nome))}</span>
      <b>${esc(a.nome)}</b><small>${esc(a.especie)}, ${esc(a.raca || 'sem raça definida')}</small>
      <small>${a.idade} ${a.idade == 1 ? 'ano' : 'anos'}</small>
      <small>Tutor: ${esc(by('clientes', a.clienteId)?.nome || '—')}</small>${tag(...petVac(a.id))}${acts('animais', a.id)}</article>`).join('')}</div>` : vazio;
  },
  clientes() {
    const l = db.clientes.filter(c => match(c.nome, c.tel, c.email));
    return l.length ? `<ul class="list">${l.map(c => {
      const an = db.animais.filter(a => a.clienteId == c.id);
      const vis = db.agenda.filter(a => a.status === 'concluido' && an.some(x => x.id == a.animalId)).length;
      return `<li class="item"><span class="av c${c.id % 3}">${esc(ini(c.nome))}</span>
      <div class="grow"><b>${esc(c.nome)}</b><small>${esc(c.tel)}${c.email ? ', ' + esc(c.email) : ''}</small>
      <small>Animais: ${esc(an.map(a => a.nome).join(', ') || 'nenhum')}. Tutor desde ${dBR(c.desde || hoje())}</small></div>
      ${tag('', vis + (vis === 1 ? ' visita' : ' visitas'))}${acts('clientes', c.id)}</li>`;
    }).join('')}</ul>` : vazio;
  },
  historico() {
    const l = db.agenda.filter(a => a.status !== 'agendado' && match(nomeAn(a), nomeSv(a), a.prof)).sort((x, y) => ord(y, x));
    return tabela(['Data', 'Animal', 'Serviço', 'Profissional', 'Valor', 'Situação'],
      l.map(a => [dBR(a.data), esc(nomeAn(a)), esc(nomeSv(a)), esc(a.prof || '—'), brl(valor(a)), tag(a.status, ST[a.status])]));
  },
  vacinas() {
    const l = db.vacinas.filter(v => match(nomeAn(v), v.vacina))
      .sort((x, y) => (!!x.aplicada - !!y.aplicada) || x.proxima.localeCompare(y.proxima));
    const pets = db.animais.length ? `<div class="pets">${db.animais.map(a => `<span class="pet">${esc(a.nome)} ${tag(...petVac(a.id))}</span>`).join('')}</div>` : '';
    return pets + (l.length ? '<p class="nota">Informações declaradas pelos tutores. Marque a caixa quando a dose for aplicada.</p>' +
      `<ul class="list">${l.map(v => {
        const an = by('animais', v.animalId), tu = an && by('clientes', an.clienteId), [c, t] = vst(v);
        return `<li class="item">${chk(v)}<div class="grow"><b class="${v.aplicada ? 'feito' : ''}">${esc(an?.nome || '—')}, ${esc(v.vacina)}</b>
          <small>Tutor: ${esc(tu?.nome || '—')}. ${v.aplicada ? `Aplicada em ${dBR(v.aplicadaEm || v.proxima)}` : `Próxima dose em ${dBR(v.proxima)}`}</small></div>${tag(c, t)}${acts('vacinas', v.id)}</li>`;
      }).join('')}</ul>` : vazio);
  },
  pagamentos() {
    const p = db.agenda.filter(a => a.status === 'concluido'), rec = p.filter(a => a.pago === 'pago'), pen = p.filter(a => a.pago !== 'pago');
    const soma = l => l.reduce((s, a) => s + valor(a), 0);
    return stats([['Recebido', brl(soma(rec))], ['A receber', brl(soma(pen))], ['Ticket médio', brl(rec.length ? soma(rec) / rec.length : 0)],
      ['Formas de pagamento', FORMAS.map(f => `${f}: ${rec.filter(a => a.forma === f).length}`).join(', '), 'sm']]) +
      `<h3 class="sec">Transações recentes</h3>` + tabela(['Data', 'Animal', 'Valor', 'Forma', 'Situação'],
        p.sort((x, y) => ord(y, x)).map(a => [dBR(a.data), esc(nomeAn(a)), brl(valor(a)), esc(a.forma || '—'),
          a.pago === 'pago' ? tag('concluido', 'Pago') : `<button class="btn ghost sbtn" data-a="pagar" data-e="agenda" data-id="${a.id}">Registrar pagamento</button>`]));
  },
  servicos() {
    const l = db.servicos.filter(s => match(s.nome));
    return l.length ? `<ul class="list">${l.map(s => `<li class="item"><div class="grow"><b>${esc(s.nome)}</b><small>${s.min} minutos</small></div>
      <b>${brl(s.preco)}</b>${acts('servicos', s.id)}</li>`).join('')}</ul>` : vazio;
  }
};

const NAV = [['painel', 'Painel', 'home'], ['agenda', 'Agenda', 'calendar'], ['animais', 'Animais', 'paw'], ['clientes', 'Tutores', 'users'],
  ['historico', 'Histórico', 'list'], ['vacinas', 'Vacinação', 'shield'], ['pagamentos', 'Pagamentos', 'wallet'], ['servicos', 'Serviços', 'tag']];
$('#nav').innerHTML = NAV.map(([v, t, i]) => `<button data-v="${v}">${ic(i)}${t}</button>`).join('');

function render() {
  $('#titulo').textContent = NAV.find(n => n[0] === view)[1];
  $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  $('#novo').hidden = ['painel', 'historico', 'pagamentos'].includes(view);
  $('#busca').hidden = !['clientes', 'animais', 'servicos', 'historico', 'vacinas'].includes(view);
  $('#view').innerHTML = R[view]();
}

const menu = on => { $('#side').classList.toggle('open', on); $('#scrim').hidden = !on; };
function ir(v) {
  view = v; q = ''; $('#busca').value = '';
  if (v === 'agenda') dia = hoje();
  menu(false); render(); scrollTo(0, 0);
}
$('#menuBtn').onclick = () => menu(true);
$('#scrim').onclick = () => menu(false);
$('#nav').onclick = e => { const b = e.target.closest('button'); if (b) ir(b.dataset.v); };
$('#novo').onclick = () => abrir(view);
$('#busca').oninput = e => { q = e.target.value.toLowerCase().trim(); render(); };
$('#view').addEventListener('change', e => { if (e.target.id === 'dia' && e.target.value) { dia = e.target.value; render(); } });
$('#view').addEventListener('click', ev => {
  const b = ev.target.closest('[data-a]'); if (!b) return;
  const { a, e: ent, id } = b.dataset, item = ent && id ? by(ent, id) : null;
  const mv = n => { const d = new Date(dia + 'T12:00'); d.setDate(d.getDate() + n); dia = iso(d); render(); };
  if (a === 'ir') ir(b.dataset.v);
  else if (a === 'novo') abrir(ent);
  else if (!item && ['edit', 'del', 'ok', 'cancel', 'reabrir', 'vac', 'pagar'].includes(a)) return;
  else if (a === 'edit') abrir(ent, item);
  else if (a === 'del') apagar(ent, id);
  else if (a === 'ok' || a === 'cancel') {
    item.status = a === 'ok' ? 'concluido' : 'cancelado'; item.pago = 'pendente'; delete item.forma; save(); render();
    toast(a === 'ok' ? 'Atendimento concluído' : 'Agendamento cancelado');
  }
  else if (a === 'reabrir') { item.status = 'agendado'; item.pago = 'pendente'; delete item.forma; save(); render(); toast('Atendimento reaberto'); }
  else if (a === 'vac') {
    item.aplicada = b.checked; item.aplicadaEm = b.checked ? hoje() : ''; save(); render();
    toast(b.checked ? 'Vacina aplicada. Cadastre a próxima dose, se houver.' : 'Vacina voltou para pendente');
  }
  else if (a === 'pagar') form('Registrar pagamento', [{ n: 'forma', l: 'Forma de pagamento', o: FORMAS.map(f => [f, f]) }], null,
    v => { item.pago = 'pago'; item.forma = v.forma; save(); render(); toast('Pagamento registrado'); }, 'Confirmar');
  else if (a === 'prev') mv(-1);
  else if (a === 'next') mv(1);
  else if (a === 'hoje') { dia = hoje(); render(); }
});

/* ===== Login ===== */
function mostrar(logado) {
  $('#login').hidden = logado; $('#app').hidden = !logado;
  if (logado) { view = 'painel'; render(); }
}

$('#toggleSenha').onclick = () => {
  const i = $('#senha'), mostrarSenha = i.type === 'password';
  i.type = mostrarSenha ? 'text' : 'password';
  $('#toggleSenha').setAttribute('aria-label', mostrarSenha ? 'Ocultar senha' : 'Mostrar senha');
};

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = $('#email').value.trim(), sn = $('#senha').value;
  let ok = true;
  const err = (id, m) => {
    $(`[data-for=${id}]`).textContent = m;
    $('#' + id).closest('.field').classList.toggle('bad', !!m);
    if (m) ok = false;
  };
  err('email', /^\S+@\S+\.\S+$/.test(em) ? '' : 'Informe um e-mail válido, como nome@petshop.com.br.');
  err('senha', sn.length >= 6 ? '' : 'A senha precisa ter pelo menos 6 caracteres.');
  if (!ok) return;
  const btn = $('#entrar'); btn.disabled = true; btn.textContent = 'Entrando...';
  setTimeout(() => {
    setSess(em, $('#lembrar').checked);
    btn.disabled = false; btn.innerHTML = `Entrar na plataforma ${ic('chev')}`;
    $('#senha').value = ''; mostrar(true);
  }, 600);
});

$('#esqueci').onclick = () => form('Recuperar senha', [{ n: 'email', l: 'E-mail da conta', t: 'email', r: 1 }],
  { email: $('#email').value }, v => toast(`Se ${v.email} tiver cadastro, enviaremos o link para criar uma nova senha.`), 'Enviar link');
$('#suporte').onclick = () => form('Falar com o suporte',
  [{ n: 'nome', l: 'Seu nome', r: 1 }, { n: 'msg', l: 'Como podemos ajudar?', r: 1 }], null,
  () => toast('Mensagem enviada. Respondemos em até 1 dia útil.'), 'Enviar mensagem');
$('#sair').onclick = () => { clrSess(); menu(false); mostrar(false); };

mostrar(!!getSess());
