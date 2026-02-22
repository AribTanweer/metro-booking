// ============================================
// Metro Network Mock Data — Delhi Metro Inspired
// ============================================

export const METRO_LINES = {
  yellow: {
    id: 'yellow',
    name: 'Yellow Line',
    color: '#F7C948',
    stations: ['samaypur-badli', 'rohini-sector-18', 'haiderpur-badli-mor', 'jahangirpuri', 'adarsh-nagar', 'ghitorni', 'arjan-garh', 'guru-dronacharya', 'sikandarpur', 'mg-road', 'iffco-chowk', 'huda-city-centre', 'vishwavidyalaya', 'vidhan-sabha', 'civil-lines', 'kashmere-gate', 'chandni-chowk', 'chawri-bazar', 'new-delhi', 'rajiv-chowk', 'patel-chowk', 'central-secretariat', 'udyog-bhawan', 'race-course', 'jor-bagh', 'ina', 'aiims', 'green-park', 'hauz-khas', 'malviya-nagar', 'saket', 'qutab-minar'],
  },
  blue: {
    id: 'blue',
    name: 'Blue Line',
    color: '#2196F3',
    stations: ['noida-electronic-city', 'noida-sector-62', 'noida-sector-59', 'noida-sector-52', 'noida-sector-34', 'noida-sector-15', 'new-ashok-nagar', 'mayur-vihar-ext', 'mayur-vihar-1', 'akshardham', 'yamuna-bank', 'indraprastha', 'pragati-maidan', 'mandi-house', 'barakhamba-road', 'rajiv-chowk', 'ramakrishna-ashram', 'jhandewalan', 'karol-bagh', 'rajendra-place', 'patel-nagar', 'shadipur', 'kirti-nagar', 'moti-nagar', 'ramesh-nagar', 'rajouri-garden', 'tagore-garden', 'subhash-nagar', 'tilak-nagar', 'janakpuri-east', 'janakpuri-west', 'dwarka'],
  },
  red: {
    id: 'red',
    name: 'Red Line',
    color: '#EF5350',
    stations: ['shaheed-sthal', 'hindon-river', 'arthala', 'mohan-nagar', 'shyam-park', 'major-mohit-sharma', 'raj-bagh', 'shaheed-nagar', 'dilshad-garden', 'jhilmil', 'mansarovar-park', 'shahdara', 'welcome', 'seelampur', 'shastri-park', 'kashmere-gate', 'tis-hazari', 'pul-bangash', 'pratap-nagar', 'shastri-nagar', 'inder-lok', 'kanhaiya-nagar', 'keshav-puram', 'netaji-subhash-place', 'kohat-enclave', 'pitam-pura', 'rohini-east', 'rohini-west', 'rithala'],
  },
  green: {
    id: 'green',
    name: 'Green Line',
    color: '#66BB6A',
    stations: ['inderlok-green', 'ashok-park-main', 'punjabi-bagh', 'shivaji-park', 'madipur', 'paschim-vihar-east', 'paschim-vihar-west', 'peeragarhi', 'udyog-nagar', 'surajmal-stadium', 'nangloi', 'nangloi-railway', 'rajdhani-park', 'mundka', 'mundka-ind-area', 'ghevra', 'tikri-kalan', 'tikri-border', 'pandit-shree-ram-sharma', 'bahadurgarh-city', 'brigadier-hoshiar-singh'],
  },
  violet: {
    id: 'violet',
    name: 'Violet Line',
    color: '#AB47BC',
    stations: ['kashmere-gate-violet', 'lal-quila', 'jama-masjid', 'delhi-gate', 'ito', 'mandi-house', 'janpath', 'central-secretariat', 'khan-market', 'jawaharlal-nehru-stadium', 'jangpura', 'lajpat-nagar', 'moolchand', 'kailash-colony', 'nehru-place', 'greater-kailash', 'govindpuri', 'harkesh-nagar-okhla', 'jasola-apollo', 'sarita-vihar', 'mohan-estate', 'tughlakabad', 'badarpur-border', 'sarai', 'nhpc-chowk', 'mewala-maharajpur', 'sector-28-faridabad', 'badkhal-mor', 'old-faridabad', 'neelam-chowk-ajronda', 'escorts-mujesar', 'raja-nahar-singh'],
  },
  magenta: {
    id: 'magenta',
    name: 'Magenta Line',
    color: '#EC407A',
    stations: ['janakpuri-west', 'dabri-mor', 'dashrathpuri', 'palam', 'sadar-bazar-cantonment', 'terminal-1-igi-airport', 'shankar-vihar', 'vasant-vihar', 'munirka', 'r-k-puram', 'ina-magenta', 'sarojini-nagar', 'ignou', 'arjan-garh', 'ghitorni', 'sultanpur', 'chattarpur', 'qutab-minar', 'saket', 'malviya-nagar', 'hauz-khas', 'panchsheel-park', 'chirag-delhi', 'greater-kailash', 'nehru-enclave', 'kalkaji-mandir', 'okhla-nsic', 'sukhdev-vihar', 'jamia-millia-islamia', 'okhla-vihar', 'jasola-vihar-shaheen-bagh', 'kalindi-kunj', 'botanical-garden'],
  },
};

// Generate station details from lines
function buildStationData() {
  const stations = {};

  Object.entries(METRO_LINES).forEach(([lineId, line]) => {
    line.stations.forEach((stationId, index) => {
      const name = stationId
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (!stations[stationId]) {
        stations[stationId] = {
          id: stationId,
          name,
          lines: [],
          isInterchange: false,
          facilities: generateFacilities(stationId),
          position: getStationPosition(stationId),
        };
      }

      stations[stationId].lines.push({
        lineId,
        lineName: line.name,
        lineColor: line.color,
        index,
      });

      if (stations[stationId].lines.length > 1) {
        stations[stationId].isInterchange = true;
      }
    });
  });

  return stations;
}

function generateFacilities(stationId) {
  const facilities = ['accessibility'];
  const hash = stationId.length + stationId.charCodeAt(0);
  if (hash % 3 === 0) facilities.push('parking');
  if (hash % 2 === 0) facilities.push('elevator');
  facilities.push('exits');
  return facilities;
}

// Hand-crafted schematic positions on a clean grid
// Uses horizontal/vertical/45° diagonal lines, uniform spacing
// Grid unit = 50px, viewBox 1500×1300 — wide spacing for readable labels
const STATION_POSITIONS = {
  // ===== YELLOW LINE (vertical, center) =====
  'samaypur-badli': { x: 550, y: 40 },
  'rohini-sector-18': { x: 550, y: 90 },
  'haiderpur-badli-mor': { x: 550, y: 140 },
  'jahangirpuri': { x: 550, y: 190 },
  'adarsh-nagar': { x: 550, y: 240 },
  'ghitorni': { x: 550, y: 290 },
  'arjan-garh': { x: 550, y: 340 },
  'guru-dronacharya': { x: 550, y: 390 },
  'sikandarpur': { x: 550, y: 440 },
  'mg-road': { x: 550, y: 490 },
  'iffco-chowk': { x: 550, y: 540 },
  'huda-city-centre': { x: 550, y: 590 },
  'vishwavidyalaya': { x: 620, y: 190 },
  'vidhan-sabha': { x: 620, y: 240 },
  'civil-lines': { x: 620, y: 290 },
  'kashmere-gate': { x: 660, y: 340 },     // MAJOR interchange
  'chandni-chowk': { x: 660, y: 390 },
  'chawri-bazar': { x: 660, y: 440 },
  'new-delhi': { x: 660, y: 490 },
  'rajiv-chowk': { x: 660, y: 540 },       // MAJOR interchange
  'patel-chowk': { x: 660, y: 590 },
  'central-secretariat': { x: 660, y: 640 },// interchange with violet
  'udyog-bhawan': { x: 660, y: 700 },
  'race-course': { x: 660, y: 750 },
  'jor-bagh': { x: 660, y: 800 },
  'ina': { x: 660, y: 850 },
  'aiims': { x: 660, y: 900 },
  'green-park': { x: 660, y: 950 },
  'hauz-khas': { x: 660, y: 1000 },        // interchange with magenta
  'malviya-nagar': { x: 660, y: 1050 },
  'saket': { x: 660, y: 1100 },
  'qutab-minar': { x: 660, y: 1150 },

  // ===== BLUE LINE (horizontal, center) =====
  'noida-electronic-city': { x: 1350, y: 540 },
  'noida-sector-62': { x: 1300, y: 540 },
  'noida-sector-59': { x: 1250, y: 540 },
  'noida-sector-52': { x: 1200, y: 540 },
  'noida-sector-34': { x: 1150, y: 540 },
  'noida-sector-15': { x: 1100, y: 540 },
  'new-ashok-nagar': { x: 1050, y: 540 },
  'mayur-vihar-ext': { x: 1000, y: 540 },
  'mayur-vihar-1': { x: 950, y: 540 },
  'akshardham': { x: 900, y: 540 },
  'yamuna-bank': { x: 850, y: 540 },
  'indraprastha': { x: 800, y: 540 },
  'pragati-maidan': { x: 750, y: 540 },
  'mandi-house': { x: 710, y: 540 },       // interchange with violet
  // rajiv-chowk at 660,540
  'barakhamba-road': { x: 610, y: 540 },
  'ramakrishna-ashram': { x: 560, y: 540 },
  'jhandewalan': { x: 510, y: 540 },
  'karol-bagh': { x: 460, y: 540 },
  'rajendra-place': { x: 410, y: 540 },
  'patel-nagar': { x: 360, y: 540 },
  'shadipur': { x: 310, y: 540 },
  'kirti-nagar': { x: 260, y: 540 },
  'moti-nagar': { x: 210, y: 540 },
  'ramesh-nagar': { x: 160, y: 540 },
  'rajouri-garden': { x: 110, y: 540 },
  'tagore-garden': { x: 60, y: 540 },
  'subhash-nagar': { x: 60, y: 590 },
  'tilak-nagar': { x: 60, y: 640 },
  'janakpuri-east': { x: 60, y: 690 },
  'janakpuri-west': { x: 60, y: 740 },     // interchange with magenta
  'dwarka': { x: 60, y: 790 },

  // ===== RED LINE (horizontal, top) =====
  'shaheed-sthal': { x: 1350, y: 340 },
  'hindon-river': { x: 1300, y: 340 },
  'arthala': { x: 1250, y: 340 },
  'mohan-nagar': { x: 1200, y: 340 },
  'shyam-park': { x: 1150, y: 340 },
  'major-mohit-sharma': { x: 1100, y: 340 },
  'raj-bagh': { x: 1050, y: 340 },
  'shaheed-nagar': { x: 1000, y: 340 },
  'dilshad-garden': { x: 950, y: 340 },
  'jhilmil': { x: 900, y: 340 },
  'mansarovar-park': { x: 850, y: 340 },
  'shahdara': { x: 800, y: 340 },
  'welcome': { x: 750, y: 340 },
  'seelampur': { x: 720, y: 340 },
  'shastri-park': { x: 690, y: 340 },
  // kashmere-gate at 660,340
  'tis-hazari': { x: 610, y: 340 },
  'pul-bangash': { x: 560, y: 340 },
  'pratap-nagar': { x: 510, y: 340 },
  'shastri-nagar': { x: 460, y: 340 },
  'inder-lok': { x: 410, y: 340 },
  'kanhaiya-nagar': { x: 360, y: 340 },
  'keshav-puram': { x: 310, y: 340 },
  'netaji-subhash-place': { x: 260, y: 340 },
  'kohat-enclave': { x: 210, y: 340 },
  'pitam-pura': { x: 160, y: 340 },
  'rohini-east': { x: 110, y: 340 },
  'rohini-west': { x: 60, y: 340 },
  'rithala': { x: 20, y: 340 },

  // ===== GREEN LINE (branches SW from Inderlok area) =====
  'inderlok-green': { x: 410, y: 390 },
  'ashok-park-main': { x: 370, y: 410 },
  'punjabi-bagh': { x: 330, y: 430 },
  'shivaji-park': { x: 290, y: 450 },
  'madipur': { x: 240, y: 450 },
  'paschim-vihar-east': { x: 190, y: 450 },
  'paschim-vihar-west': { x: 140, y: 450 },
  'peeragarhi': { x: 90, y: 450 },
  'udyog-nagar': { x: 40, y: 450 },
  'surajmal-stadium': { x: 40, y: 500 },
  'nangloi': { x: 40, y: 550 },
  'nangloi-railway': { x: 40, y: 600 },
  'rajdhani-park': { x: 40, y: 650 },
  'mundka': { x: 40, y: 700 },
  'mundka-ind-area': { x: 40, y: 750 },
  'ghevra': { x: 40, y: 800 },
  'tikri-kalan': { x: 40, y: 850 },
  'tikri-border': { x: 40, y: 900 },
  'pandit-shree-ram-sharma': { x: 40, y: 950 },
  'bahadurgarh-city': { x: 40, y: 1000 },
  'brigadier-hoshiar-singh': { x: 40, y: 1050 },

  // ===== VIOLET LINE (north-south, right of yellow) =====
  'kashmere-gate-violet': { x: 700, y: 340 },
  'lal-quila': { x: 740, y: 390 },
  'jama-masjid': { x: 740, y: 440 },
  'delhi-gate': { x: 740, y: 490 },
  'ito': { x: 720, y: 520 },
  // mandi-house at 710,540
  'janpath': { x: 690, y: 590 },
  // central-secretariat at 660,640
  'khan-market': { x: 700, y: 700 },
  'jawaharlal-nehru-stadium': { x: 740, y: 750 },
  'jangpura': { x: 780, y: 800 },
  'lajpat-nagar': { x: 820, y: 850 },
  'moolchand': { x: 820, y: 900 },
  'kailash-colony': { x: 820, y: 950 },
  'nehru-place': { x: 820, y: 1000 },
  'greater-kailash': { x: 820, y: 1050 },  // interchange with magenta
  'govindpuri': { x: 820, y: 1100 },
  'harkesh-nagar-okhla': { x: 860, y: 1150 },
  'jasola-apollo': { x: 910, y: 1150 },
  'sarita-vihar': { x: 960, y: 1150 },
  'mohan-estate': { x: 1010, y: 1150 },
  'tughlakabad': { x: 1060, y: 1150 },
  'badarpur-border': { x: 1110, y: 1150 },
  'sarai': { x: 1110, y: 1200 },
  'nhpc-chowk': { x: 1110, y: 1250 },
  'mewala-maharajpur': { x: 1110, y: 1300 },
  'sector-28-faridabad': { x: 1160, y: 1300 },
  'badkhal-mor': { x: 1210, y: 1300 },
  'old-faridabad': { x: 1260, y: 1300 },
  'neelam-chowk-ajronda': { x: 1310, y: 1300 },
  'escorts-mujesar': { x: 1360, y: 1300 },
  'raja-nahar-singh': { x: 1420, y: 1300 },

  // ===== MAGENTA LINE (diagonal NW to SE) =====
  // janakpuri-west at 60,740
  'dabri-mor': { x: 110, y: 770 },
  'dashrathpuri': { x: 160, y: 800 },
  'palam': { x: 210, y: 830 },
  'sadar-bazar-cantonment': { x: 260, y: 860 },
  'terminal-1-igi-airport': { x: 310, y: 890 },
  'shankar-vihar': { x: 360, y: 920 },
  'vasant-vihar': { x: 410, y: 950 },
  'munirka': { x: 460, y: 970 },
  'r-k-puram': { x: 510, y: 990 },
  'ina-magenta': { x: 600, y: 850 },
  'sarojini-nagar': { x: 550, y: 830 },
  'ignou': { x: 560, y: 880 },
  // arjan-garh at 550,340 – shared
  // ghitorni at 550,290 – shared
  'sultanpur': { x: 600, y: 1100 },
  'chattarpur': { x: 620, y: 1130 },
  // qutab-minar at 660,1150
  // saket at 660,1100
  // malviya-nagar at 660,1050
  // hauz-khas at 660,1000
  'panchsheel-park': { x: 710, y: 1000 },
  'chirag-delhi': { x: 760, y: 1000 },
  // greater-kailash at 820,1050
  'nehru-enclave': { x: 770, y: 1050 },
  'kalkaji-mandir': { x: 870, y: 1050 },
  'okhla-nsic': { x: 920, y: 1050 },
  'sukhdev-vihar': { x: 970, y: 1050 },
  'jamia-millia-islamia': { x: 1020, y: 1050 },
  'okhla-vihar': { x: 1070, y: 1050 },
  'jasola-vihar-shaheen-bagh': { x: 1120, y: 1050 },
  'kalindi-kunj': { x: 1170, y: 1050 },
  'botanical-garden': { x: 1230, y: 1050 },
};

function getStationPosition(stationId) {
  return STATION_POSITIONS[stationId] || { x: 700, y: 550 };
}

export const STATIONS = buildStationData();

export const INTERCHANGE_STATIONS = Object.values(STATIONS).filter(s => s.isInterchange);

// ==========================
// Route Finding (Dijkstra)
// ==========================

const TRANSFER_PENALTY = 5; // minutes to change lines

/**
 * Deterministic inter-station travel time based on station IDs.
 * Produces consistent 2–4 minute values (unlike the old Math.random approach).
 */
function stationPairDuration(a, b) {
  let hash = 0;
  const key = a < b ? `${a}|${b}` : `${b}|${a}`;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return 2 + (Math.abs(hash) % 3); // 2, 3, or 4 minutes
}

function buildGraph() {
  const graph = {};

  Object.entries(METRO_LINES).forEach(([lineId, line]) => {
    line.stations.forEach((stationId, index) => {
      if (!graph[stationId]) graph[stationId] = [];

      // Add edges to adjacent stations on this line
      if (index > 0) {
        const prev = line.stations[index - 1];
        graph[stationId].push({
          to: prev,
          line: lineId,
          duration: stationPairDuration(stationId, prev),
        });
      }
      if (index < line.stations.length - 1) {
        const next = line.stations[index + 1];
        graph[stationId].push({
          to: next,
          line: lineId,
          duration: stationPairDuration(stationId, next),
        });
      }
    });
  });

  return graph;
}

const GRAPH = buildGraph();

/**
 * Dijkstra shortest-path (by total weighted time including transfer penalties).
 * Returns the raw path array: [{ stationId, line, duration, cumulativeTime }]
 *
 * @param {string} sourceId
 * @param {string} destId
 * @param {Set<string>} [excludeEdges] – edges to exclude (for K-shortest-paths diversity)
 * @returns {Array|null}
 */
function dijkstra(sourceId, destId, excludeEdges = new Set()) {
  // dist[stationId:lineId] = best cumulative time arriving at station via lineId
  const dist = {};
  const prev = {};
  // Priority queue as a simple sorted array (sufficient for metro-scale graphs)
  const pq = [];

  const startKey = `${sourceId}:_start`;
  dist[startKey] = 0;
  pq.push({ key: startKey, stationId: sourceId, line: '_start', time: 0 });

  while (pq.length > 0) {
    // Extract minimum
    pq.sort((a, b) => a.time - b.time);
    const current = pq.shift();

    if (current.time > (dist[current.key] ?? Infinity)) continue;

    if (current.stationId === destId) {
      // Reconstruct path
      const path = [];
      let k = current.key;
      while (k) {
        const [sid, line] = k.split(':');
        path.unshift({ stationId: sid, line: line === '_start' ? null : line, duration: 0 });
        k = prev[k];
      }
      // Fill in durations from the graph
      for (let i = 1; i < path.length; i++) {
        const edge = (GRAPH[path[i - 1].stationId] || []).find(
          e => e.to === path[i].stationId && e.line === path[i].line
        );
        path[i].duration = edge?.duration ?? 3;
      }
      return path;
    }

    const neighbors = GRAPH[current.stationId] || [];
    for (const edge of neighbors) {
      const edgeKey = `${current.stationId}->${edge.to}:${edge.line}`;
      if (excludeEdges.has(edgeKey)) continue;

      // Transfer penalty: changing lines costs extra time
      const transferCost =
        current.line !== '_start' && current.line !== edge.line ? TRANSFER_PENALTY : 0;
      const newTime = current.time + edge.duration + transferCost;
      const nextKey = `${edge.to}:${edge.line}`;

      if (newTime < (dist[nextKey] ?? Infinity)) {
        dist[nextKey] = newTime;
        prev[nextKey] = current.key;
        pq.push({ key: nextKey, stationId: edge.to, line: edge.line, time: newTime });
      }
    }
  }

  return null; // no path
}

/**
 * Find up to 3 diverse routes using modified K-shortest-paths.
 * Strategy: find fastest, then penalise shared edges to find alternatives.
 */
export function findRoutes(sourceId, destId) {
  if (!sourceId || !destId || sourceId === destId) return [];
  if (!GRAPH[sourceId] || !GRAPH[destId]) return [];

  const results = [];
  const excludeEdges = new Set();

  // Find up to 3 routes, each time excluding core edges of the previous route
  for (let k = 0; k < 3; k++) {
    const path = dijkstra(sourceId, destId, excludeEdges);
    if (!path) break;

    const route = buildRoute(path);

    // Check for duplicates (same sequence of lines)
    const lineSeq = route.segments.map(s => s.line).join(',');
    const isDuplicate = results.some(
      r => r.segments.map(s => s.line).join(',') === lineSeq
    );
    if (!isDuplicate) {
      results.push(route);
    }

    // Exclude middle edges of this path to force diversity on next iteration
    for (let i = 1; i < path.length - 1; i++) {
      const seg = path[i];
      const prev = path[i - 1];
      excludeEdges.add(`${prev.stationId}->${seg.stationId}:${seg.line}`);
    }
  }

  // Sort: primary by total duration, secondary by fewer transfers
  results.sort((a, b) => a.totalDuration - b.totalDuration || a.transfers - b.transfers);

  // Label the routes
  if (results.length > 0) results[0].label = 'Fastest';
  if (results.length > 1) {
    // Find which is fewest transfers (if different from fastest)
    const fewestTransfers = [...results].sort((a, b) => a.transfers - b.transfers)[0];
    const fewestStops = [...results].sort((a, b) => a.totalStops - b.totalStops)[0];
    results.forEach(r => {
      if (!r.label) {
        if (r === fewestTransfers) r.label = 'Fewest Transfers';
        else if (r === fewestStops) r.label = 'Fewest Stops';
        else r.label = 'Alternative';
      }
    });
  }

  return results;
}

function buildRoute(path) {
  const segments = [];
  let currentLine = null;
  let segmentStops = [];

  for (let i = 1; i < path.length; i++) {
    const step = path[i];
    if (step.line !== currentLine) {
      if (segmentStops.length > 0) {
        segments.push({
          line: currentLine,
          lineColor: METRO_LINES[currentLine]?.color || '#999',
          lineName: METRO_LINES[currentLine]?.name || 'Unknown',
          stations: [...segmentStops],
          duration: segmentStops.reduce((sum, s) => sum + (s.duration || 2), 0),
        });
      }
      currentLine = step.line;
      segmentStops = [{ stationId: path[i - 1].stationId, duration: 0 }];
    }
    segmentStops.push({ stationId: step.stationId, duration: step.duration });
  }

  if (segmentStops.length > 0) {
    segments.push({
      line: currentLine,
      lineColor: METRO_LINES[currentLine]?.color || '#999',
      lineName: METRO_LINES[currentLine]?.name || 'Unknown',
      stations: [...segmentStops],
      duration: segmentStops.reduce((sum, s) => sum + (s.duration || 2), 0),
    });
  }

  const totalStops = path.length - 1;
  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0) + (segments.length - 1) * 3;
  const transfers = segments.length - 1;
  const fare = calculateFare(totalStops);

  return { segments, totalStops, totalDuration, transfers, fare };
}

function calculateFare(stops) {
  if (stops <= 2) return 10;
  if (stops <= 5) return 20;
  if (stops <= 12) return 30;
  if (stops <= 21) return 40;
  return 50;
}

// ==========================
// Utility Exports
// ==========================
export function getStationById(id) {
  return STATIONS[id] || null;
}

export function searchStations(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return Object.values(STATIONS)
    .filter(s => s.name.toLowerCase().includes(q))
    .slice(0, 10);
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('metro-recent-searches') || '[]');
  } catch {
    return [];
  }
}

export function saveRecentSearch(source, destination) {
  const recent = getRecentSearches();
  const entry = { source, destination, timestamp: Date.now() };
  const filtered = recent.filter(
    r => !(r.source === source && r.destination === destination)
  );
  const updated = [entry, ...filtered].slice(0, 5);
  localStorage.setItem('metro-recent-searches', JSON.stringify(updated));
}

export function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'MBS-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// Version compatibility data for admin panel
export const VERSION_MATRIX = {
  versions: ['v1.0', 'v1.1', 'v1.2', 'v2.0', 'v2.1', 'v3.0'],
  compatibility: {
    'v1.0-v1.1': { status: 'green', tooltip: 'Direct upgrade supported' },
    'v1.0-v1.2': { status: 'amber', tooltip: 'Requires v1.1 intermediate step' },
    'v1.0-v2.0': { status: 'amber', tooltip: 'Requires v1.2 intermediate step' },
    'v1.0-v2.1': { status: 'red', tooltip: 'Blocked — incompatible schema' },
    'v1.0-v3.0': { status: 'red', tooltip: 'Blocked — major version gap' },
    'v1.1-v1.2': { status: 'green', tooltip: 'Direct upgrade supported' },
    'v1.1-v2.0': { status: 'amber', tooltip: 'Requires v1.2 intermediate step' },
    'v1.1-v2.1': { status: 'red', tooltip: 'Blocked — incompatible schema' },
    'v1.1-v3.0': { status: 'red', tooltip: 'Blocked — major version gap' },
    'v1.2-v2.0': { status: 'green', tooltip: 'Direct upgrade supported' },
    'v1.2-v2.1': { status: 'green', tooltip: 'Direct upgrade supported' },
    'v1.2-v3.0': { status: 'amber', tooltip: 'Requires v2.1 intermediate step' },
    'v2.0-v2.1': { status: 'green', tooltip: 'Direct upgrade supported' },
    'v2.0-v3.0': { status: 'amber', tooltip: 'Requires v2.1 intermediate step' },
    'v2.1-v3.0': { status: 'green', tooltip: 'Direct upgrade supported' },
  },
};
