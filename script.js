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
  chev: '<path d="M9 6l6 6-6 6"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
$$('[data-ic]').forEach(el => el.innerHTML = ic(el.dataset.ic));

let tt;
const toast = m => {
  const t = $('#toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
};

/* ===== Dados (salvos no navegador) ===== */
const KEY = 'pelo:dados', SESS = 'pelo:sessao';
const seed = () => ({
  seq: 100,
  clientes: [
    { id: 1, nome: 'Thiago Almeida', tel: '(21) 98888-1111', email: 'thiago@email.com' },
    { id: 2, nome: 'Amanda Moreira', tel: '(21) 97777-2222', email: 'amanda@email.com' },
    { id: 3, nome: 'Beatriz Esteves', tel: '(21) 96666-3333', email: 'bia@email.com' }],
  animais: [
    { id: 1, nome: 'Thor', especie: 'Cão', raca: 'Golden Retriever', clienteId: 1 },
    { id: 2, nome: 'Mel', especie: 'Gato', raca: 'Siamês', clienteId: 2 },
    { id: 3, nome: 'Bento', especie: 'Cão', raca: 'Shih Tzu', clienteId: 3 }],
  servicos: [
    { id: 1, nome: 'Banho', preco: 60, min: 45 },
    { id: 2, nome: 'Tosa higiênica', preco: 50, min: 30 },
    { id: 3, nome: 'Banho e tosa', preco: 110, min: 90 }],
  agenda: [
    { id: 1, data: hoje(), hora: '09:00', animalId: 1, servicoId: 3, status: 'agendado' },
    { id: 2, data: hoje(), hora: '11:00', animalId: 2, servicoId: 1, status: 'agendado' },
    { id: 3, data: hoje(1), hora: '14:30', animalId: 3, servicoId: 2, status: 'agendado' }]
});
let db = null;
try { db = JSON.parse(localStorage.getItem(KEY)); } catch { }
db = db || seed();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { } };
const nid = () => ++db.seq;
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
    ? `<select name="${c.n}" ${c.r ? 'required' : ''}>${c.o.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`
    : `<input name="${c.n}" type="${c.t || 'text'}" ${c.r ? 'required' : ''} ${c.s ? `step="${c.s}" min="0"` : ''}>`}</label>`).join('');
  const f = $('#dlgForm');
  campos.forEach(c => f.elements[c.n].value = valores?.[c.n] ?? c.d ?? '');
  f.onsubmit = e => {
    e.preventDefault();
    const v = {}; campos.forEach(c => v[c.n] = f.elements[c.n].value.trim());
    onSave(v); $('#dlg').close();
  };
  $('#dlg').showModal();
}
$('#dlgC').onclick = () => $('#dlg').close();

/* ===== Entidades ===== */
let view = 'painel', dia = hoje(), q = '';
const E = {
  clientes: { nome: 'cliente', campos: () => [
    { n: 'nome', l: 'Nome', r: 1 }, { n: 'tel', l: 'Telefone', t: 'tel', r: 1 }, { n: 'email', l: 'E-mail', t: 'email' }] },
  animais: { nome: 'animal', campos: () => [
    { n: 'nome', l: 'Nome', r: 1 },
    { n: 'especie', l: 'Espécie', o: [['Cão', 'Cão'], ['Gato', 'Gato'], ['Outro', 'Outro']] },
    { n: 'raca', l: 'Raça' },
    { n: 'clienteId', l: 'Tutor', r: 1, o: db.clientes.map(c => [c.id, c.nome]) }] },
  servicos: { nome: 'serviço', campos: () => [
    { n: 'nome', l: 'Nome do serviço', r: 1 },
    { n: 'preco', l: 'Preço (R$)', t: 'number', s: '0.01', r: 1 },
    { n: 'min', l: 'Duração (minutos)', t: 'number', s: '5', r: 1 }] },
  agenda: { nome: 'agendamento', campos: () => [
    { n: 'data', l: 'Data', t: 'date', r: 1, d: dia },
    { n: 'hora', l: 'Hora', t: 'time', r: 1 },
    { n: 'animalId', l: 'Animal', r: 1, o: db.animais.map(a => [a.id, `${a.nome} (${by('clientes', a.clienteId)?.nome || 's/ tutor'})`]) },
    { n: 'servicoId', l: 'Serviço', r: 1, o: db.servicos.map(s => [s.id, `${s.nome} – ${brl(s.preco)}`]) }] }
};

function abrir(ent, item) {
  const e = E[ent], campos = e.campos();
  if (campos.some(c => c.o && !c.o.length)) return toast('Cadastre antes um cliente, animal ou serviço para continuar.');
  form(`${item ? 'Editar' : 'Novo'} ${e.nome}`, campos, item, v => {
    ['clienteId', 'animalId', 'servicoId', 'preco', 'min'].forEach(k => { if (k in v) v[k] = Number(v[k]); });
    if (item) Object.assign(item, v);
    else db[ent].push({ id: nid(), ...(ent === 'agenda' ? { status: 'agendado' } : {}), ...v });
    save(); render(); toast('Salvo com sucesso');
  });
}

function apagar(ent, id) {
  if (!confirm('Excluir este registro? Esta ação não pode ser desfeita.')) return;
  const casc = {
    clientes() { const an = db.animais.filter(a => a.clienteId == id).map(a => a.id); db.animais = db.animais.filter(a => !an.includes(a.id)); db.agenda = db.agenda.filter(a => !an.includes(a.animalId)); },
    animais() { db.agenda = db.agenda.filter(a => a.animalId != id); },
    servicos() { db.agenda = db.agenda.filter(a => a.servicoId != id); }
  };
  casc[ent]?.();
  db[ent] = db[ent].filter(x => x.id != id);
  save(); render(); toast('Registro excluído');
}

/* ===== Telas ===== */
const ST = { agendado: 'Agendado', concluido: 'Concluído', cancelado: 'Cancelado' };
const vazio = '<p class="empty">Nada por aqui ainda. Use “Novo” para adicionar.</p>';
const acts = (ent, id, extra = '') => `<div class="acts">${extra}
  <button class="icon" data-a="edit" data-e="${ent}" data-id="${id}" aria-label="Editar" title="Editar">${ic('edit')}</button>
  <button class="icon danger" data-a="del" data-e="${ent}" data-id="${id}" aria-label="Excluir" title="Excluir">${ic('trash')}</button></div>`;

const lista = ag => ag.length ? `<ul class="list">${ag.map(a => {
  const an = by('animais', a.animalId), s = by('servicos', a.servicoId), c = an && by('clientes', an.clienteId);
  const extra = a.status === 'agendado'
    ? `<button class="icon" data-a="ok" data-e="agenda" data-id="${a.id}" aria-label="Concluir" title="Concluir">${ic('check')}</button>
       <button class="icon" data-a="cancel" data-e="agenda" data-id="${a.id}" aria-label="Cancelar" title="Cancelar">${ic('x')}</button>` : '';
  return `<li class="item"><time>${esc(a.hora)}</time>
    <div class="grow"><b>${esc(an?.nome || '—')}</b><small>${esc(s?.nome || '—')} para ${esc(c?.nome || '—')}</small></div>
    <span class="tag ${a.status}">${ST[a.status]}</span>${acts('agenda', a.id, extra)}</li>`;
}).join('')}</ul>` : '<p class="empty">Nenhum atendimento neste dia. Use “Novo” para agendar.</p>';

const doDia = d => db.agenda.filter(a => a.data === d).sort((x, y) => x.hora.localeCompare(y.hora));
const match = (...t) => t.join(' ').toLowerCase().includes(q);

const R = {
  painel() {
    const ag = doDia(hoje());
    const rec = ag.filter(a => a.status !== 'cancelado').reduce((s, a) => s + (by('servicos', a.servicoId)?.preco || 0), 0);
    return `<div class="stats">${[['Atendimentos hoje', ag.length], ['Animais', db.animais.length], ['Clientes', db.clientes.length], ['Receita prevista', brl(rec)]]
      .map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('')}</div>
      <h3 class="sec">Agenda de hoje</h3>${lista(ag)}`;
  },
  agenda() {
    return `<div class="datebar"><button class="icon" data-a="prev" aria-label="Dia anterior" style="transform:scaleX(-1)">${ic('chev')}</button>
      <input type="date" id="dia" value="${dia}" aria-label="Data">
      <button class="icon" data-a="next" aria-label="Próximo dia">${ic('chev')}</button>
      <button class="btn ghost" data-a="hoje">Hoje</button></div>${lista(doDia(dia))}`;
  },
  clientes() {
    const l = db.clientes.filter(c => match(c.nome, c.tel, c.email));
    return l.length ? `<ul class="list">${l.map(c => `<li class="item"><span class="av c${c.id % 3}">${esc(ini(c.nome))}</span>
      <div class="grow"><b>${esc(c.nome)}</b><small>${esc(c.tel)}${c.email ? ' – ' + esc(c.email) : ''}</small></div>
      <span class="tag">${db.animais.filter(a => a.clienteId == c.id).length} animais</span>${acts('clientes', c.id)}</li>`).join('')}</ul>` : vazio;
  },
  animais() {
    const l = db.animais.filter(a => match(a.nome, a.raca, a.especie, by('clientes', a.clienteId)?.nome));
    return l.length ? `<div class="grid">${l.map(a => `<article class="card"><span class="av c${a.id % 3}">${esc(ini(a.nome))}</span>
      <b>${esc(a.nome)}</b><small>${esc(a.especie)}, ${esc(a.raca || 'sem raça definida')}</small>
      <small>Tutor: ${esc(by('clientes', a.clienteId)?.nome || '—')}</small>${acts('animais', a.id)}</article>`).join('')}</div>` : vazio;
  },
  servicos() {
    const l = db.servicos.filter(s => match(s.nome));
    return l.length ? `<ul class="list">${l.map(s => `<li class="item"><div class="grow"><b>${esc(s.nome)}</b><small>${s.min} minutos</small></div>
      <b>${brl(s.preco)}</b>${acts('servicos', s.id)}</li>`).join('')}</ul>` : vazio;
  }
};

const NAV = [['painel', 'Painel', 'home'], ['agenda', 'Agenda', 'calendar'], ['clientes', 'Clientes', 'users'], ['animais', 'Animais', 'paw'], ['servicos', 'Serviços', 'tag']];
$('#nav').innerHTML = NAV.map(([v, t, i]) => `<button data-v="${v}">${ic(i)}${t}</button>`).join('');

function render() {
  $('#titulo').textContent = NAV.find(n => n[0] === view)[1];
  $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  $('#novo').hidden = view === 'painel';
  $('#busca').hidden = !['clientes', 'animais', 'servicos'].includes(view);
  $('#view').innerHTML = R[view]();
}

const menu = abrir_ => { $('#side').classList.toggle('open', abrir_); $('#scrim').hidden = !abrir_; };
$('#menuBtn').onclick = () => menu(true);
$('#scrim').onclick = () => menu(false);
$('#nav').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  view = b.dataset.v; q = ''; $('#busca').value = ''; menu(false); render();
};
$('#novo').onclick = () => abrir(view);
$('#busca').oninput = e => { q = e.target.value.toLowerCase().trim(); render(); };
$('#view').addEventListener('change', e => { if (e.target.id === 'dia' && e.target.value) { dia = e.target.value; render(); } });
$('#view').addEventListener('click', ev => {
  const b = ev.target.closest('[data-a]'); if (!b) return;
  const { a, e: ent, id } = b.dataset, item = ent && by(ent, id);
  const mv = n => { const d = new Date(dia + 'T12:00'); d.setDate(d.getDate() + n); dia = iso(d); render(); };
  if (a === 'edit') abrir(ent, item);
  else if (a === 'del') apagar(ent, id);
  else if (a === 'ok' || a === 'cancel') {
    item.status = a === 'ok' ? 'concluido' : 'cancelado'; save(); render();
    toast(a === 'ok' ? 'Atendimento concluído' : 'Agendamento cancelado');
  }
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
