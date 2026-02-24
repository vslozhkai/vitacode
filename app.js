const FOOD_DB = Array.isArray(window.VITACODE_FOOD_DB) ? window.VITACODE_FOOD_DB : [];
const SUPPLEMENT_DB = Array.isArray(window.VITACODE_SUPPLEMENT_DB) ? window.VITACODE_SUPPLEMENT_DB : [];

const STORAGE_KEY = 'vitacode-v2';

const DAILY_BASE = {
  vitamins: {
    a: { name: 'Витамин A', unit: 'мг' },
    c: { name: 'Витамин C', unit: 'мг' },
    d3: { name: 'Витамин D3', unit: 'мг' },
    e: { name: 'Витамин E', unit: 'мг' },
    k1: { name: 'Витамин K', unit: 'мг' },
    b1: { name: 'B1', unit: 'мг' },
    b2: { name: 'B2', unit: 'мг' },
    b3: { name: 'B3', unit: 'мг' },
    b6: { name: 'B6', unit: 'мг' },
    b9: { name: 'B9', unit: 'мг' },
    b12: { name: 'B12', unit: 'мг' }
  },
  minerals: {
    ca: { name: 'Кальций', unit: 'мг' },
    fe: { name: 'Железо', unit: 'мг' },
    mg: { name: 'Магний', unit: 'мг' },
    zn: { name: 'Цинк', unit: 'мг' },
    se: { name: 'Селен', unit: 'мг' },
    k: { name: 'Калий', unit: 'мг' },
    p: { name: 'Фосфор', unit: 'мг' },
    mn: { name: 'Марганец', unit: 'мг' },
    na: { name: 'Натрий (верх. предел)', unit: 'мг', mode: 'max' },
    i: { name: 'Йод', unit: 'мг' }
  },
  aminoByKg: {
    histidine: { name: 'Гистидин', unit: 'мг', mgPerKg: 10 },
    isoleucine: { name: 'Изолейцин', unit: 'мг', mgPerKg: 20 },
    leucine: { name: 'Лейцин', unit: 'мг', mgPerKg: 39 },
    lysine: { name: 'Лизин', unit: 'мг', mgPerKg: 30 },
    methionine: { name: 'Метионин', unit: 'мг', mgPerKg: 15 },
    phenylalanine: { name: 'Фенилаланин', unit: 'мг', mgPerKg: 25 },
    threonine: { name: 'Треонин', unit: 'мг', mgPerKg: 15 },
    tryptophan: { name: 'Триптофан', unit: 'мг', mgPerKg: 4 },
    valine: { name: 'Валин', unit: 'мг', mgPerKg: 26 }
  }
};

const EVIDENCE = {
  overtraining: { label: 'Overtraining syndrome consensus, PMID:24614439', url: 'https://pubmed.ncbi.nlm.nih.gov/24614439/' },
  stressImmune: { label: 'Stress and immune function, PMID:25267412', url: 'https://pubmed.ncbi.nlm.nih.gov/25267412/' }
};

const CATEGORY_EMOJI = {
  'Крупы': '🌾',
  'Овощи': '🥦',
  'Фрукты': '🍊',
  'Белки': '🍗',
  'Молочные': '🥛',
  'Орехи': '🌰',
  'Жиры': '🫒',
  'Выпечка': '🍞',
  'Блюда': '🍲',
  'Бобовые': '🫘',
  'Спортпит': '💪'
};

const els = {
  profileForm: document.getElementById('profile-form'),
  sexInput: document.getElementById('sex-input'),
  ageInput: document.getElementById('age-input'),
  heightInput: document.getElementById('height-input'),
  weightInput: document.getElementById('weight-input'),
  goalInput: document.getElementById('goal-input'),
  activityInput: document.getElementById('activity-input'),

  foodSearch: document.getElementById('food-search'),
  foodSearchBtn: document.getElementById('food-search-btn'),
  foodSearchResults: document.getElementById('food-search-results'),

  entryForm: document.getElementById('entry-form'),
  foodSelect: document.getElementById('food-select'),
  gramsInput: document.getElementById('grams-input'),
  mealSelect: document.getElementById('meal-select'),

  supplementForm: document.getElementById('supplement-form'),
  supplementSelect: document.getElementById('supplement-select'),
  supplementServings: document.getElementById('supplement-servings'),
  supplementTime: document.getElementById('supplement-time'),
  supplementList: document.getElementById('supplement-list'),

  summary: document.getElementById('summary'),
  twinStatus: document.getElementById('twin-status'),
  twinAlerts: document.getElementById('twin-alerts'),
  macroChart: document.getElementById('macro-chart'),
  trainingChart: document.getElementById('training-chart'),

  entriesList: document.getElementById('entries-list'),
  clearBtn: document.getElementById('clear-btn'),

  vitaminsList: document.getElementById('vitamins-list'),
  mineralsList: document.getElementById('minerals-list'),
  aminoList: document.getElementById('amino-list'),

  cycleForm: document.getElementById('cycle-form'),
  cycleStartDate: document.getElementById('cycle-start-date'),
  cycleMicrocycles: document.getElementById('cycle-microcycles'),
  cycleSessionsWeek: document.getElementById('cycle-sessions-week'),
  cycleBase1rm: document.getElementById('cycle-base-1rm'),
  cycleBaseKpsh: document.getElementById('cycle-base-kpsh'),
  cycleWaveDirection: document.getElementById('cycle-wave-direction'),
  cycleStatus: document.getElementById('cycle-status'),
  cyclePreviewList: document.getElementById('cycle-preview-list'),

  workoutForm: document.getElementById('workout-form'),
  workoutDate: document.getElementById('workout-date'),
  workoutType: document.getElementById('workout-type'),
  workoutSets: document.getElementById('workout-sets'),
  workoutReps: document.getElementById('workout-reps'),
  workoutWeight: document.getElementById('workout-weight'),
  workoutRpe: document.getElementById('workout-rpe'),
  workoutIntensity: document.getElementById('workout-intensity'),
  workoutList: document.getElementById('workout-list'),

  sleepForm: document.getElementById('sleep-form'),
  sleepDate: document.getElementById('sleep-date'),
  sleepHours: document.getElementById('sleep-hours'),
  sleepQuality: document.getElementById('sleep-quality'),
  sleepList: document.getElementById('sleep-list'),

  recommendations: document.getElementById('recommendations')
};

const foodImageCache = new Map();

let state = loadState();

function init() {
  hydrateProfile();
  fillTodayDates();
  renderFoodOptions();
  renderSupplementOptions();
  bindEvents();
  registerServiceWorker();
  render();
}

function hydrateProfile() {
  els.sexInput.value = state.profile.sex;
  els.ageInput.value = String(state.profile.age);
  els.heightInput.value = String(state.profile.heightCm);
  els.weightInput.value = String(state.profile.weightKg);
  els.goalInput.value = state.profile.goal;
  els.activityInput.value = String(state.profile.activityFactor);

  els.cycleMicrocycles.value = String(state.trainingCycle.microcycles);
  els.cycleSessionsWeek.value = String(state.trainingCycle.sessionsPerWeek);
  els.cycleBase1rm.value = String(state.trainingCycle.base1rm);
  els.cycleBaseKpsh.value = String(state.trainingCycle.baseKpsh);
  els.cycleWaveDirection.value = state.trainingCycle.waveDirection;
  els.cycleStartDate.value = state.trainingCycle.startDate || todayKey();
}

function fillTodayDates() {
  const day = todayKey();
  els.sleepDate.value = day;
  els.workoutDate.value = day;
}

function bindEvents() {
  els.profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.profile = {
      sex: els.sexInput.value,
      age: clamp(num(els.ageInput.value), 18, 99),
      heightCm: clamp(num(els.heightInput.value), 130, 230),
      weightKg: clamp(num(els.weightInput.value), 35, 250),
      goal: els.goalInput.value,
      activityFactor: num(els.activityInput.value)
    };
    persistState();
    render();
  });

  els.foodSearchBtn.addEventListener('click', renderFoodSearch);
  els.foodSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      renderFoodSearch();
    }
  });

  els.entryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addFoodEntry();
  });

  els.supplementForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addSupplementEntry();
  });

  els.clearBtn.addEventListener('click', () => {
    state.entries = [];
    state.supplementEntries = [];
    persistState();
    render();
  });

  els.cycleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    buildTrainingCycle();
  });

  els.workoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addWorkout();
  });

  els.sleepForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addSleep();
  });
}

function renderFoodOptions() {
  els.foodSelect.innerHTML = state.foodDb
    .map((food) => `<option value="${food.id}">${escapeHtml(food.name)} (${escapeHtml(food.category || 'Прочее')})</option>`)
    .join('');
}

function renderSupplementOptions() {
  els.supplementSelect.innerHTML = SUPPLEMENT_DB
    .map((supplement) => `<option value="${supplement.id}">${escapeHtml(supplement.name)}</option>`)
    .join('');
}

function renderFoodSearch() {
  const query = (els.foodSearch.value || '').trim().toLowerCase();
  const items = state.foodDb
    .filter((food) => `${food.name} ${food.category || ''}`.toLowerCase().includes(query))
    .slice(0, 24);

  els.foodSearchResults.innerHTML = items.length
    ? items
        .map(
          (food) => `<li class="item media">
            <img class="food-thumb" src="${foodImage(food)}" alt="${escapeHtml(food.name)}" loading="lazy" />
            <div>
              <div class="item-top"><strong>${escapeHtml(food.name)}</strong><span class="item-meta">${escapeHtml(food.category || 'Прочее')}</span></div>
              <div class="item-meta">${Math.round(num(food.kcal))} ккал / 100г</div>
            </div>
          </li>`
        )
        .join('')
    : '<li class="item"><span class="item-meta">Ничего не найдено.</span></li>';
}

function addFoodEntry() {
  const food = state.foodDb.find((item) => item.id === els.foodSelect.value);
  const grams = num(els.gramsInput.value);
  if (!food || grams <= 0) return;

  state.entries.unshift({
    id: crypto.randomUUID(),
    foodId: food.id,
    grams,
    meal: els.mealSelect.value,
    createdAt: Date.now()
  });

  persistState();
  render();
}

function addSupplementEntry() {
  const supplement = SUPPLEMENT_DB.find((item) => item.id === els.supplementSelect.value);
  const servings = num(els.supplementServings.value);
  if (!supplement || servings <= 0) return;

  state.supplementEntries.unshift({
    id: crypto.randomUUID(),
    supplementId: supplement.id,
    servings,
    time: els.supplementTime.value,
    createdAt: Date.now()
  });

  persistState();
  render();
}

function buildTrainingCycle() {
  const cfg = {
    startDate: els.cycleStartDate.value,
    microcycles: clamp(num(els.cycleMicrocycles.value), 4, 24),
    sessionsPerWeek: clamp(num(els.cycleSessionsWeek.value), 2, 7),
    base1rm: clamp(num(els.cycleBase1rm.value), 20, 500),
    baseKpsh: clamp(num(els.cycleBaseKpsh.value), 20, 400),
    waveDirection: els.cycleWaveDirection.value
  };

  state.trainingCycle = {
    ...cfg,
    sessions: generateCycleSessions(cfg)
  };

  persistState();
  render();
}

function addWorkout() {
  const date = els.workoutDate.value;
  const type = els.workoutType.value.trim();
  const sets = num(els.workoutSets.value);
  const reps = num(els.workoutReps.value);
  const weight = num(els.workoutWeight.value);
  const rpe = clamp(num(els.workoutRpe.value), 1, 10);
  if (!date || !type || sets <= 0 || reps <= 0 || weight <= 0) return;

  const lifts = sets * reps;
  const tonnage = lifts * weight;
  const duration = Math.max(20, Math.round(sets * 2.2 + reps * sets * 0.4 + 20));
  const plan = (state.trainingCycle.sessions || []).find((session) => session.date === date);

  state.workouts.unshift({
    id: crypto.randomUUID(),
    date,
    type,
    sets,
    reps,
    weight,
    rpe,
    duration,
    intensity: els.workoutIntensity.value,
    lifts,
    tonnage,
    plannedTonnage: num(plan?.plannedTonnage),
    plannedKpsh: num(plan?.plannedKpsh),
    createdAt: Date.now()
  });

  persistState();
  render();
}

function addSleep() {
  const date = els.sleepDate.value;
  const hours = num(els.sleepHours.value);
  const quality = clamp(num(els.sleepQuality.value), 1, 5);
  if (!date || hours < 0) return;

  state.sleepEntries.unshift({
    id: crypto.randomUUID(),
    date,
    hours,
    quality,
    createdAt: Date.now()
  });

  persistState();
  render();
}

function render() {
  const day = todayKey();
  const dayEntries = state.entries.filter((entry) => sameDayTs(entry.createdAt, day));
  const daySupplements = state.supplementEntries.filter((entry) => sameDayTs(entry.createdAt, day));
  const dayWorkouts = state.workouts.filter((workout) => normalizeDay(workout.date) === day);
  const daySleep = state.sleepEntries.find((sleep) => normalizeDay(sleep.date) === day) || null;

  const totals = calculateTotals(dayEntries, state.foodDb, daySupplements);
  const targets = getPersonalTargets(state.profile, dayWorkouts, day);
  const sleepStats = getSleepStats(state.sleepEntries);
  const trainingStats = getTrainingStats(state.workouts, state.trainingCycle, state.sleepEntries, state.profile);
  const twin = evaluateDigitalTwin({
    dayEntries,
    totals,
    targets,
    trainingStats,
    sleepStats,
    daySleep,
    dayWorkouts,
    profile: state.profile
  });

  renderSummary(totals, targets, trainingStats, twin);
  renderFoodDiary(dayEntries);
  renderSupplementsDiary(daySupplements);
  renderSleepDiary();
  renderWorkoutDiary();
  renderCyclePreview(trainingStats);
  renderNutrients(els.vitaminsList, totals.vitamins, targets.vitamins);
  renderNutrients(els.mineralsList, totals.minerals, targets.minerals);
  renderNutrients(els.aminoList, totals.aminoAcids, targets.aminoAcids);
  renderCharts(totals, state.workouts, state.sleepEntries);
  renderTwinAlerts(twin);
  renderRecommendations(totals, targets, trainingStats, twin);
  renderFoodSearch();
}

function renderSummary(totals, targets, trainingStats, twin) {
  const cards = [
    { label: 'Калории', value: `${Math.round(totals.calories)} / ${Math.round(targets.calories)} ккал` },
    { label: 'Белок', value: `${formatNum(totals.protein)} / ${Math.round(targets.protein)} г` },
    { label: 'Клетчатка', value: `${formatNum(totals.fiber)} / ${Math.round(targets.fiber)} г` },
    { label: 'Вода из пищи', value: `${formatNum(totals.water / 1000)} / ${formatNum(targets.waterL)} л` },
    { label: 'Тоннаж за 7д', value: `${Math.round(trainingStats.weekTonnage)} кг` },
    { label: 'КПШ за 7д', value: `${trainingStats.weekLifts}` },
    { label: 'План/факт', value: `${Math.round(trainingStats.planCompletionPct)}%` },
    { label: 'Риск перетрена', value: trainingStats.overtrainingRisk }
  ];

  els.summary.innerHTML = cards
    .map((card) => `<article class="kpi"><div class="k-label">${card.label}</div><div class="k-value">${card.value}</div></article>`)
    .join('');

  const statusClass = twin.severity >= 3 ? 'danger' : twin.severity >= 1 ? 'warn' : 'ok';
  els.twinStatus.className = `status-chip ${statusClass}`;
  els.twinStatus.textContent = `Статус цифрового двойника: ${twin.status}`;
}

function renderFoodDiary(dayEntries) {
  if (!dayEntries.length) {
    els.entriesList.innerHTML = '<li class="item"><span class="item-meta">Сегодня записей питания нет.</span></li>';
    return;
  }

  els.entriesList.innerHTML = dayEntries
    .map((entry) => {
      const food = state.foodDb.find((item) => item.id === entry.foodId);
      if (!food) return '';
      const kcal = Math.round(num(food.kcal) * (entry.grams / 100));
      return `<li class="item media">
        <img class="food-thumb" src="${foodImage(food)}" alt="${escapeHtml(food.name)}" loading="lazy" />
        <div>
          <div class="item-top"><strong>${escapeHtml(food.name)}</strong><button class="remove" data-id="${entry.id}" data-type="food">Удалить</button></div>
          <div class="item-meta">${entry.meal} • ${Math.round(entry.grams)} г • ${kcal} ккал</div>
        </div>
      </li>`;
    })
    .join('');

  bindRemoveButtons();
}

function renderSupplementsDiary(daySupplements) {
  if (!daySupplements.length) {
    els.supplementList.innerHTML = '<li class="item"><span class="item-meta">Сегодня БАДы не добавлены.</span></li>';
    return;
  }

  els.supplementList.innerHTML = daySupplements
    .map((entry) => {
      const supplement = SUPPLEMENT_DB.find((item) => item.id === entry.supplementId);
      if (!supplement) return '';
      return `<li class="item">
        <div class="item-top"><strong>${escapeHtml(supplement.name)}</strong><button class="remove" data-id="${entry.id}" data-type="supplement">Удалить</button></div>
        <div class="item-meta">${entry.time} • ${entry.servings} порц.</div>
      </li>`;
    })
    .join('');

  bindRemoveButtons();
}

function renderSleepDiary() {
  const rows = [...state.sleepEntries].sort((a, b) => num(b.createdAt) - num(a.createdAt)).slice(0, 12);
  els.sleepList.innerHTML = rows.length
    ? rows
        .map((sleep) => `<li class="item">
          <div class="item-top"><strong>${normalizeDay(sleep.date)}</strong><button class="remove" data-id="${sleep.id}" data-type="sleep">Удалить</button></div>
          <div class="item-meta">${formatNum(sleep.hours)} ч • качество ${sleep.quality}/5</div>
        </li>`)
        .join('')
    : '<li class="item"><span class="item-meta">Сон не добавлен.</span></li>';

  bindRemoveButtons();
}

function renderWorkoutDiary() {
  const rows = [...state.workouts]
    .sort((a, b) => {
      const ad = normalizeDay(a.date);
      const bd = normalizeDay(b.date);
      if (ad === bd) return num(b.createdAt) - num(a.createdAt);
      return bd.localeCompare(ad);
    })
    .slice(0, 16);

  els.workoutList.innerHTML = rows.length
    ? rows
        .map((workout) => `<li class="item">
          <div class="item-top"><strong>${normalizeDay(workout.date)} • ${escapeHtml(workout.type)}</strong><button class="remove" data-id="${workout.id}" data-type="workout">Удалить</button></div>
          <div class="item-meta">${workout.sets}x${workout.reps}x${workout.weight} • тоннаж ${Math.round(workout.tonnage)} кг • КПШ ${workout.lifts} • RPE ${formatNum(workout.rpe)}</div>
        </li>`)
        .join('')
    : '<li class="item"><span class="item-meta">Тренировок нет.</span></li>';

  bindRemoveButtons();
}

function renderCyclePreview(trainingStats) {
  const sessions = state.trainingCycle.sessions || [];
  if (!sessions.length) {
    els.cycleStatus.textContent = 'Цикл не построен.';
    els.cyclePreviewList.innerHTML = '';
    return;
  }

  els.cycleStatus.textContent = `Сессий: ${sessions.length}. Прогноз ПМ: ${Math.round(trainingStats.projectedOneRm)} кг.`;
  els.cyclePreviewList.innerHTML = sessions
    .slice(0, 14)
    .map((session) => `<li class="item"><strong>${session.date} • Микро ${session.microcycle}</strong><div class="item-meta">${session.phase} • ${session.percent}% • КПШ ${session.plannedKpsh} • тоннаж ${Math.round(session.plannedTonnage)} кг</div></li>`)
    .join('');
}

function renderNutrients(container, values, config) {
  const rows = Object.entries(config).map(([code, item]) => {
    const value = num(values[code]);
    const target = num(item.target);
    const ratio = item.mode === 'max' ? (target > 0 ? value / target : 0) : (target > 0 ? value / target : 0);
    const percentRaw = ratio * 100;
    const barWidth = clamp(percentRaw, 0, 100);

    return `<div class="n-row">
      <div class="n-head">
        <span>${item.name}</span>
        <span>${formatNum(value)} ${item.unit} (${formatNum(percentRaw)}%)${percentRaw > 100 ? ' <span class="n-over">↑</span>' : ''}</span>
      </div>
      <div class="bar"><span style="width:${barWidth}%"></span></div>
    </div>`;
  });

  container.innerHTML = rows.join('');
}

function renderCharts(totals, workouts, sleepEntries) {
  drawMacroChart(els.macroChart, totals);
  drawTrainingChart(els.trainingChart, workouts, sleepEntries);
}

function drawMacroChart(canvas, totals) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const proteinKcal = Math.max(0, totals.protein * 4);
  const fatKcal = Math.max(0, totals.fat * 9);
  const carbsKcal = Math.max(0, totals.carbs * 4);
  const sum = proteinKcal + fatKcal + carbsKcal;

  const centerX = 95;
  const centerY = h / 2;
  const radius = 70;
  const lineWidth = 24;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  const palette = ['#5f77ff', '#ffb84f', '#ff4f7c'];
  const parts = [proteinKcal, fatKcal, carbsKcal];
  let start = -Math.PI / 2;

  if (sum > 0) {
    parts.forEach((part, index) => {
      const angle = (part / sum) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = palette[index];
      ctx.arc(centerX, centerY, radius, start, start + angle);
      ctx.stroke();
      start += angle;
    });
  } else {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#f7f9ff';
  ctx.font = '700 13px Manrope';
  ctx.fillText('Б/Ж/У', 77, centerY + 5);

  const legendX = 190;
  const legendY = 56;
  const legend = [
    ['Белки', proteinKcal, palette[0]],
    ['Жиры', fatKcal, palette[1]],
    ['Углеводы', carbsKcal, palette[2]]
  ];

  legend.forEach((row, index) => {
    const y = legendY + index * 46;
    ctx.fillStyle = row[2];
    ctx.fillRect(legendX, y - 10, 14, 14);
    ctx.fillStyle = '#f7f9ff';
    ctx.font = '600 12px Manrope';
    ctx.fillText(`${row[0]}: ${Math.round(row[1])} ккал`, legendX + 22, y + 2);
  });
}

function drawTrainingChart(canvas, workouts, sleepEntries) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const days = getRecentDays(7);
  const tonnage = days.map((day) => workouts.filter((w) => normalizeDay(w.date) === day).reduce((sum, w) => sum + num(w.tonnage), 0));
  const sleep = days.map((day) => {
    const row = sleepEntries.find((s) => normalizeDay(s.date) === day);
    return row ? num(row.hours) : 0;
  });

  const maxTon = Math.max(1, ...tonnage);
  const chartX = 16;
  const chartY = 20;
  const chartW = w - 32;
  const chartH = h - 44;
  const barW = chartW / days.length - 8;

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.moveTo(chartX, chartY + chartH);
  ctx.lineTo(chartX + chartW, chartY + chartH);
  ctx.stroke();

  tonnage.forEach((value, index) => {
    const x = chartX + index * (barW + 8);
    const barH = (value / maxTon) * (chartH - 16);
    const y = chartY + chartH - barH;
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#5f77ff');
    grad.addColorStop(1, '#ff4f7c');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = 'rgba(247,249,255,0.82)';
    ctx.font = '10px Manrope';
    ctx.fillText(shortDay(days[index]), x, chartY + chartH + 14);
  });

  const maxSleep = 10;
  ctx.strokeStyle = '#ffd05a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  sleep.forEach((value, index) => {
    const x = chartX + index * (barW + 8) + barW / 2;
    const y = chartY + chartH - (clamp(value, 0, maxSleep) / maxSleep) * (chartH - 16);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function renderTwinAlerts(twin) {
  if (!twin.alerts.length) {
    els.twinAlerts.innerHTML = '<li class="item"><span class="item-meta">Критичных аномалий за день не обнаружено.</span></li>';
    return;
  }

  els.twinAlerts.innerHTML = twin.alerts
    .map((alert) => `<li class="item"><strong>${alert.title}</strong><div class="item-meta">${alert.body}</div></li>`)
    .join('');
}

function renderRecommendations(totals, targets, trainingStats, twin) {
  const recos = [];

  if (twin.severity >= 3) {
    recos.push({
      title: 'Нарушена консистентность данных и режима',
      body: 'В цифровом двойнике обнаружены небиологичные комбинации (питание/сон/нагрузка). Проверь ввод и перейди на восстановительный режим 24-48 часов.',
      links: []
    });
  }

  if (trainingStats.overtrainingRisk === 'Высокий' || trainingStats.planCompletionPct > 130) {
    recos.push({
      title: 'Высокий риск перетренированности',
      body: 'Снизь объем на 30-40% на 5-7 дней, увеличь сон до 8+ часов. Поддержка иммунитета: витамин C, D3, цинк и селен.',
      links: [EVIDENCE.overtraining, EVIDENCE.stressImmune]
    });
  }

  if (num(totals.vitamins.d3) < num(targets.vitamins.d3.target) * 0.7) {
    recos.push({
      title: 'Недобор витамина D3',
      body: 'Добавь рыбу/яйца и при необходимости D3-комплекс, с контролем 25(OH)D.',
      links: []
    });
  }

  if (num(totals.minerals.i) < num(targets.minerals.i.target) * 0.7) {
    recos.push({
      title: 'Недобор йода',
      body: 'Добавь йодированную соль и морскую рыбу. Не превышай дозы без врача.',
      links: []
    });
  }

  if (num(totals.fiber) < num(targets.fiber) * 0.8) {
    recos.push({
      title: 'Недостаточно клетчатки',
      body: 'Увеличь овощи, бобовые и цельнозерновые в 3-4 приемах пищи.',
      links: []
    });
  }

  if (num(totals.water) / 1000 < num(targets.waterL) * 0.5) {
    recos.push({
      title: 'Низкий вклад воды из рациона',
      body: 'Добавь овощи/фрукты и контролируй питьевой режим в течение дня.',
      links: []
    });
  }

  els.recommendations.innerHTML = recos.length
    ? recos
        .map((reco) => `<article class="reco"><h3>${reco.title}</h3><p>${reco.body}</p>${reco.links.length ? `<p class="item-meta">${reco.links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`).join(' • ')}</p>` : ''}</article>`)
        .join('')
    : '<article class="reco"><h3>Режим в норме</h3><p>Критичных отклонений за сегодня не выявлено. Продолжай мониторинг.</p></article>';
}

function calculateTotals(entries, foodDb, supplementEntries) {
  const totals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    water: 0,
    vitamins: {},
    minerals: {},
    aminoAcids: {}
  };

  entries.forEach((entry) => {
    const food = foodDb.find((item) => item.id === entry.foodId);
    if (!food) return;
    const ratio = num(entry.grams) / 100;

    totals.calories += num(food.kcal) * ratio;
    totals.protein += num(food.protein) * ratio;
    totals.fat += num(food.fat) * ratio;
    totals.carbs += num(food.carbs) * ratio;
    totals.fiber += num(food.fiber) * ratio;
    totals.water += num(food.water) * ratio;

    addNutrients(totals.vitamins, food.vitamins, ratio);
    addNutrients(totals.minerals, food.minerals, ratio);
    addNutrients(totals.aminoAcids, food.aminoAcids, ratio);
  });

  supplementEntries.forEach((entry) => {
    const supplement = SUPPLEMENT_DB.find((item) => item.id === entry.supplementId);
    if (!supplement) return;
    addNutrients(totals.vitamins, supplement.nutrients.vitamins, num(entry.servings));
    addNutrients(totals.minerals, supplement.nutrients.minerals, num(entry.servings));
  });

  return totals;
}

function addNutrients(target, source, ratio) {
  Object.entries(source || {}).forEach(([code, value]) => {
    target[code] = (target[code] || 0) + num(value) * ratio;
  });
}

function getPersonalTargets(profile, dayWorkouts) {
  const bmr = profile.sex === 'male'
    ? 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5
    : 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;

  let calories = bmr * profile.activityFactor;
  if (profile.goal === 'lose') calories -= 350;
  if (profile.goal === 'gain') calories += 300;

  const dayTrainingMinutes = dayWorkouts.reduce((sum, workout) => sum + num(workout.duration), 0);
  calories += dayTrainingMinutes * 4;

  const protein = profile.weightKg * (profile.goal === 'lose' ? 1.8 : 1.6);
  const fat = profile.weightKg * 0.9;
  const carbs = Math.max(80, (calories - protein * 4 - fat * 9) / 4);
  const waterL = (profile.sex === 'male' ? 3.7 : 2.7) + dayTrainingMinutes / 120;
  const fiber = Math.max(22, (calories / 1000) * 14);

  return {
    calories,
    protein,
    fat,
    carbs,
    fiber,
    waterL,
    vitamins: getVitaminTargets(profile),
    minerals: getMineralTargets(profile),
    aminoAcids: getAminoTargets(profile.weightKg)
  };
}

function getVitaminTargets(profile) {
  return {
    a: { ...DAILY_BASE.vitamins.a, target: profile.sex === 'male' ? 0.9 : 0.7 },
    c: { ...DAILY_BASE.vitamins.c, target: profile.sex === 'male' ? 90 : 75 },
    d3: { ...DAILY_BASE.vitamins.d3, target: profile.age > 70 ? 0.02 : 0.015 },
    e: { ...DAILY_BASE.vitamins.e, target: 15 },
    k1: { ...DAILY_BASE.vitamins.k1, target: profile.sex === 'male' ? 0.12 : 0.09 },
    b1: { ...DAILY_BASE.vitamins.b1, target: profile.sex === 'male' ? 1.2 : 1.1 },
    b2: { ...DAILY_BASE.vitamins.b2, target: profile.sex === 'male' ? 1.3 : 1.1 },
    b3: { ...DAILY_BASE.vitamins.b3, target: profile.sex === 'male' ? 16 : 14 },
    b6: { ...DAILY_BASE.vitamins.b6, target: profile.age > 50 ? (profile.sex === 'male' ? 1.7 : 1.5) : 1.3 },
    b9: { ...DAILY_BASE.vitamins.b9, target: 0.4 },
    b12: { ...DAILY_BASE.vitamins.b12, target: 0.0024 }
  };
}

function getMineralTargets(profile) {
  return {
    ca: { ...DAILY_BASE.minerals.ca, target: profile.age > 50 ? 1200 : 1000 },
    fe: { ...DAILY_BASE.minerals.fe, target: profile.sex === 'female' && profile.age < 51 ? 18 : 8 },
    mg: { ...DAILY_BASE.minerals.mg, target: profile.sex === 'male' ? 420 : 320 },
    zn: { ...DAILY_BASE.minerals.zn, target: profile.sex === 'male' ? 11 : 8 },
    se: { ...DAILY_BASE.minerals.se, target: 0.055 },
    k: { ...DAILY_BASE.minerals.k, target: 3400 },
    p: { ...DAILY_BASE.minerals.p, target: 700 },
    mn: { ...DAILY_BASE.minerals.mn, target: profile.sex === 'male' ? 2.3 : 1.8 },
    na: { ...DAILY_BASE.minerals.na, target: 2300 },
    i: { ...DAILY_BASE.minerals.i, target: 0.15 }
  };
}

function getAminoTargets(weightKg) {
  const targets = {};
  Object.entries(DAILY_BASE.aminoByKg).forEach(([code, item]) => {
    targets[code] = {
      name: item.name,
      unit: item.unit,
      target: item.mgPerKg * weightKg
    };
  });
  return targets;
}

function getSleepStats(sleepEntries) {
  const recent = [...sleepEntries]
    .sort((a, b) => normalizeDay(b.date).localeCompare(normalizeDay(a.date)))
    .slice(0, 7);

  const avgHours = avg(recent.map((row) => num(row.hours)));
  const avgQuality = avg(recent.map((row) => num(row.quality)));
  return { avgHours, avgQuality };
}

function getTrainingStats(workouts, cycle, sleepEntries, profile) {
  const days = getRecentDays(7);
  const weekRows = workouts.filter((workout) => days.includes(normalizeDay(workout.date)));

  const weekTonnage = weekRows.reduce((sum, row) => sum + num(row.tonnage), 0);
  const weekLifts = weekRows.reduce((sum, row) => sum + num(row.lifts), 0);
  const weekPlanTonnage = weekRows.reduce((sum, row) => sum + num(row.plannedTonnage), 0);
  const planCompletionPct = weekPlanTonnage > 0 ? (weekTonnage / weekPlanTonnage) * 100 : 0;

  const avgRpe = avg(weekRows.map((row) => num(row.rpe)));
  const avgSleep = getSleepStats(sleepEntries).avgHours;
  const relativeLoad = weekTonnage / Math.max(1, profile.weightKg * 700);

  const riskScore =
    (planCompletionPct > 120 ? 1 : 0) +
    (avgRpe >= 8.8 ? 1 : 0) +
    (avgSleep > 0 && avgSleep < 6.5 ? 1 : 0) +
    (relativeLoad > 1.35 ? 1 : 0);

  const overtrainingRisk = riskScore >= 3 ? 'Высокий' : riskScore === 2 ? 'Средний' : 'Низкий';
  const projectedOneRm = forecastOneRm(cycle, workouts, overtrainingRisk);

  return {
    weekTonnage,
    weekLifts,
    weekPlanTonnage,
    planCompletionPct,
    overtrainingRisk,
    projectedOneRm,
    avgRpe,
    relativeLoad
  };
}

function forecastOneRm(cycle, workouts, risk) {
  const base = num(cycle.base1rm) || 100;
  const recent = [...workouts].slice(0, 20);
  if (!recent.length) return base;

  const best = Math.max(...recent.map((row) => num(row.weight) * (1 + num(row.reps) / 30)));
  const factor = risk === 'Высокий' ? 0.985 : risk === 'Средний' ? 0.995 : 1.01;
  return best * factor;
}

function evaluateDigitalTwin(input) {
  const foodMassKg = input.dayEntries.reduce((sum, entry) => sum + num(entry.grams), 0) / 1000;
  const calories = num(input.totals.calories);
  const sleepToday = input.daySleep ? num(input.daySleep.hours) : 0;
  const dayTonnage = input.dayWorkouts.reduce((sum, workout) => sum + num(workout.tonnage), 0);
  const dayLifts = input.dayWorkouts.reduce((sum, workout) => sum + num(workout.lifts), 0);
  const maxSingleMeal = input.dayEntries.reduce((max, entry) => Math.max(max, num(entry.grams)), 0);
  const sodium = num(input.totals.minerals.na);
  const waterFromFood = num(input.totals.water) / 1000;

  const alerts = [];

  if (foodMassKg > 12) {
    alerts.push({ title: 'Экстремальный объем пищи', body: `За день занесено ${formatNum(foodMassKg)} кг пищи. Проверь точность данных.` });
  }

  if (calories > Math.max(input.targets.calories * 3, 10000)) {
    alerts.push({ title: 'Калорийность вне физиологического диапазона', body: `Занесено ${Math.round(calories)} ккал за день.` });
  }

  if (maxSingleMeal > 5000) {
    alerts.push({ title: 'Нереалистичный размер одного приема', body: `Один прием содержит ${Math.round(maxSingleMeal)} г.` });
  }

  if (sleepToday > 16) {
    alerts.push({ title: 'Сон выше реалистичного диапазона', body: `Зафиксировано ${formatNum(sleepToday)} ч сна.` });
  }

  if (sleepToday > 0 && sleepToday < 3) {
    alerts.push({ title: 'Критический недосып', body: `Сон ${formatNum(sleepToday)} ч при таком режиме повышает риск срыва восстановления.` });
  }

  if (dayTonnage > Math.max(30000, input.profile.weightKg * 320)) {
    alerts.push({ title: 'Экстремальный тренировочный тоннаж', body: `Сегодняшний тоннаж ${Math.round(dayTonnage)} кг, проверь корректность записи.` });
  }

  if (dayLifts > 1500) {
    alerts.push({ title: 'Экстремальный объем подъемов', body: `Количество подъемов ${Math.round(dayLifts)} за день выходит за рабочий диапазон.` });
  }

  if (input.trainingStats.planCompletionPct > 140) {
    alerts.push({ title: 'Перевыполнение плана', body: `План выполнен на ${Math.round(input.trainingStats.planCompletionPct)}%. Высокий риск перетренированности.` });
  }

  if (sodium > input.targets.minerals.na.target * 2 && waterFromFood < input.targets.waterL * 0.5) {
    alerts.push({ title: 'Соль/вода дисбаланс', body: 'Высокий натрий при низком водном балансе может ухудшать восстановление и самочувствие.' });
  }

  if (foodMassKg > 8 && dayTonnage > 15000 && sleepToday > 12) {
    alerts.push({ title: 'Комбинация данных небиологична', body: 'Питание, тренировка и сон за сутки плохо согласуются с физиологией. Проверь дневник.' });
  }

  const severity = alerts.length >= 4 ? 3 : alerts.length >= 2 ? 2 : alerts.length >= 1 ? 1 : 0;
  const status = severity >= 3 ? 'критические расхождения модели' : severity >= 1 ? 'есть аномалии данных/режима' : 'согласованный режим';

  return { alerts, severity, status };
}

function generateCycleSessions(cfg) {
  const wave = [
    { phase: 'Высокообъемная', percent: 67, kpshFactor: 1.15 },
    { phase: 'Средняя', percent: 75, kpshFactor: 1.0 },
    { phase: 'Высокоинтенсивная', percent: 84, kpshFactor: 0.72 }
  ];

  const sessions = [];
  const start = new Date(cfg.startDate);
  let shift = 0;

  for (let micro = 1; micro <= cfg.microcycles; micro += 1) {
    for (let day = 1; day <= cfg.sessionsPerWeek; day += 1) {
      const block = wave[(day - 1) % wave.length];
      const trend = getWaveTrend(cfg.waveDirection, micro, cfg.microcycles);
      const percent = clamp(block.percent + trend, 55, 95);
      const plannedWeight = (cfg.base1rm * percent) / 100;
      const plannedKpsh = Math.max(18, Math.round(cfg.baseKpsh * block.kpshFactor));

      sessions.push({
        id: crypto.randomUUID(),
        microcycle: micro,
        sessionNum: day,
        date: formatDate(addDays(start, shift)),
        phase: block.phase,
        percent,
        plannedWeight,
        plannedKpsh,
        plannedTonnage: plannedKpsh * plannedWeight
      });

      shift += Math.max(1, Math.floor(7 / cfg.sessionsPerWeek));
    }
  }

  return sessions;
}

function getWaveTrend(direction, micro, total) {
  if (direction === 'up') {
    return Math.round(((micro - 1) / Math.max(1, total - 1)) * 8);
  }

  const half = Math.ceil(total / 2);
  if (micro <= half) {
    return Math.round(((micro - 1) / Math.max(1, half - 1)) * 8);
  }

  return Math.round(((total - micro) / Math.max(1, total - half)) * 8);
}

function bindRemoveButtons() {
  document.querySelectorAll('.remove').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const type = button.dataset.type;

      if (type === 'food') state.entries = state.entries.filter((entry) => entry.id !== id);
      if (type === 'supplement') state.supplementEntries = state.supplementEntries.filter((entry) => entry.id !== id);
      if (type === 'sleep') state.sleepEntries = state.sleepEntries.filter((entry) => entry.id !== id);
      if (type === 'workout') state.workouts = state.workouts.filter((entry) => entry.id !== id);

      persistState();
      render();
    });
  });
}

function foodImage(food) {
  if (!food || !food.id) return '';
  if (foodImageCache.has(food.id)) return foodImageCache.get(food.id);

  const emoji = CATEGORY_EMOJI[food.category] || '🍽️';
  const letter = (food.name || '?').trim()[0] || '?';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 92 92"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4f7c"/><stop offset="1" stop-color="#5f77ff"/></linearGradient></defs><rect width="92" height="92" rx="20" fill="#171a32"/><rect x="8" y="8" width="76" height="76" rx="16" fill="url(#g)" opacity="0.28"/><text x="46" y="39" text-anchor="middle" font-size="24">${emoji}</text><text x="46" y="70" text-anchor="middle" fill="#f7f9ff" font-size="18" font-weight="700">${escapeXml(letter)}</text></svg>`;
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  foodImageCache.set(food.id, url);
  return url;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();

    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      foodDb: Array.isArray(parsed.foodDb) && parsed.foodDb.length ? parsed.foodDb : FOOD_DB,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      supplementEntries: Array.isArray(parsed.supplementEntries) ? parsed.supplementEntries : [],
      sleepEntries: Array.isArray(parsed.sleepEntries) ? parsed.sleepEntries : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      trainingCycle: {
        ...defaultState().trainingCycle,
        ...(parsed.trainingCycle || {}),
        sessions: Array.isArray(parsed.trainingCycle?.sessions) ? parsed.trainingCycle.sessions : []
      }
    };
  } catch {
    return defaultState();
  }
}

function defaultState() {
  return {
    profile: {
      sex: 'female',
      age: 30,
      heightCm: 170,
      weightKg: 70,
      goal: 'maintain',
      activityFactor: 1.375
    },
    foodDb: FOOD_DB,
    entries: [],
    supplementEntries: [],
    sleepEntries: [],
    workouts: [],
    trainingCycle: {
      startDate: '',
      microcycles: 12,
      sessionsPerWeek: 4,
      base1rm: 120,
      baseKpsh: 90,
      waveDirection: 'up-down',
      sessions: []
    }
  };
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

function getRecentDays(count) {
  const days = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    days.push(formatDate(day));
  }
  return days;
}

function shortDay(dateKey) {
  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString('ru-RU', { weekday: 'short' });
}

function normalizeDay(value) {
  if (!value) return '';
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return '';
  return formatDate(date);
}

function todayKey() {
  return formatDate(new Date());
}

function sameDayTs(ts, day) {
  const date = new Date(num(ts));
  if (Number.isNaN(date.getTime())) return false;
  return formatDate(date) === day;
}

function addDays(date, days) {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function avg(values) {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function formatNum(value) {
  return num(value).toLocaleString('ru-RU', {
    minimumFractionDigits: Math.abs(num(value)) < 10 ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeXml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

init();
