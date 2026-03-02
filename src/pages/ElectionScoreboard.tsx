import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "election_names";
const ROUND_WORDS = ["", "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"];
const RANK_WORDS = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشرة"];
const CALC_VALS = [20, 40, 60, 80, 120, 180, 250, 300, 500];
const MANUAL_URL = "https://scoreboard.alentkhbat.com/files/game-manual.pdf";

type CalcTarget =
  | { type: "round"; name: string }
  | { type: "resign" }
  | { type: "badel" }
  | { type: "council"; name: string }
  | null;

interface Player {
  name: string;
  total: number;
  roundVotes: number;
  resigned: boolean;
}

interface HistoryEntry {
  round: number;
  data: { name: string; rv: number; tv: number }[];
}

function loadSavedNames(): string[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

function saveNames(names: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

function roundToText(n: number, isFinal: boolean) {
  if (isFinal) return "الجولة النهائية";
  return "الجولة " + (ROUND_WORDS[n] || n);
}

// Icons as inline SVG components
const IconCalc = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);
const IconBadel = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 21l-4-4 4-4" />
    <path d="M3 17h18" />
    <path d="M17 3l4 4-4 4" />
    <path d="M21 7H3" />
  </svg>
);
const IconDownload = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const IconBook = () => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V5A2.5 2.5 0 0 1 6.5 2.5H20v13H6.5a2.5 2.5 0 0 0-2.5 2.5z" />
  </svg>
);
const IconHistory = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);
const IconPenalty = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
  </svg>
);
const IconResign = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const IconCouncil = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 10h18M5 10V21M19 10V21M9 10V21M15 10V21M12 3l7 7H5l7-7z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-6 h-6 align-middle ml-2.5" viewBox="0 0 24 24" fill="none" stroke="#332b1a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
  </svg>
);
const IconPencil = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const sheetClass = "bg-[#1a233a] w-full max-w-[420px] rounded-[25px] p-6 border border-[var(--line)] relative max-h-[90vh] overflow-y-auto mx-4 [&>button]:hidden";
const btnGold =
  "bg-[var(--gold)] text-[#332b1a] border-0 py-4 px-4 rounded-[15px] text-[1.15rem] font-extrabold cursor-pointer w-full flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(197,160,89,0.25)] disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none disabled:grayscale hover:bg-[var(--gold-hover)] hover:-translate-y-px";
const btnOutline =
  "bg-white/[0.03] border border-[var(--line)] text-[var(--white)] py-3.5 px-3 rounded-[14px] font-semibold cursor-pointer flex items-center justify-center text-[0.95rem] transition-colors active:bg-white/10 active:border-[var(--gold)]";
const cardClass =
  "bg-[var(--card-bg)] border border-[var(--line)] rounded-[15px] py-4 px-5 flex justify-between items-center cursor-pointer transition-colors font-bold text-[1.05rem]";
const cardSelected = "border-[var(--gold)] bg-[var(--gold)]/15";
const navBtn =
  "bg-white/5 border border-[var(--line)] w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[var(--gold)] cursor-pointer transition active:scale-90 active:bg-[var(--gold)]/10 no-underline";

export default function ElectionScoreboard() {
  const [savedNames, setSavedNames] = useState<string[]>(loadSavedNames);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [view, setView] = useState<"select" | "dashboard" | "result">("select");

  const [modalRound, setModalRound] = useState(false);
  const [modalResign, setModalResign] = useState(false);
  const [modalBadel, setModalBadel] = useState(false);
  const [modalCouncil, setModalCouncil] = useState(false);
  const [modalPenalty, setModalPenalty] = useState(false);
  const [modalEditScore, setModalEditScore] = useState(false);
  const [modalAddPlayer, setModalAddPlayer] = useState(false);
  const [modalCalc, setModalCalc] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalInstall, setModalInstall] = useState(false);

  const [editingOldName, setEditingOldName] = useState<string | null>(null);
  const [addPlayerInput, setAddPlayerInput] = useState("");
  const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);
  const [editScoreInput, setEditScoreInput] = useState("");
  const [resignPlayer, setResignPlayer] = useState<string | null>(null);
  const [resignVotes, setResignVotes] = useState("");
  const [badelSelected, setBadelSelected] = useState<string[]>([]);
  const [badelAmount, setBadelAmount] = useState("");
  const [penaltyPlayer, setPenaltyPlayer] = useState<string | null>(null);
  const [councilImmune, setCouncilImmune] = useState<Set<string>>(new Set());
  const [councilInputs, setCouncilInputs] = useState<Record<string, string>>({});
  const [roundInputs, setRoundInputs] = useState<Record<string, string>>({});

  const [calcSum, setCalcSum] = useState(0);
  const [calcCounts, setCalcCounts] = useState<Record<number, number>>({});
  const [calcTarget, setCalcTarget] = useState<CalcTarget>(null);
  const [calcShowApply, setCalcShowApply] = useState(false);

  const persistNames = useCallback((names: string[]) => {
    setSavedNames(names);
    saveNames(names);
  }, []);

  const togglePlayer = (name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const openAdd = () => {
    setEditingOldName(null);
    setAddPlayerInput("");
    setModalAddPlayer(true);
  };
  const openEdit = (oldName: string) => {
    setEditingOldName(oldName);
    setAddPlayerInput(oldName);
    setModalAddPlayer(true);
  };
  const deleteName = (name: string) => {
    if (!confirm(`حذف ${name}؟`)) return;
    const next = savedNames.filter((n) => n !== name);
    setSelectedNames((prev) => {
      const s = new Set(prev);
      s.delete(name);
      return s;
    });
    persistNames(next);
  };
  const confirmAddPlayer = () => {
    const name = addPlayerInput.trim();
    if (!name) return;
    if (editingOldName) {
      persistNames(savedNames.map((n) => (n === editingOldName ? name : n)));
      setSelectedNames((prev) => {
        const s = new Set(prev);
        s.delete(editingOldName);
        s.add(name);
        return s;
      });
    } else {
      persistNames([...savedNames, name]);
    }
    setModalAddPlayer(false);
  };

  const openEditScore = (name: string) => {
    const p = players.find((x) => x.name === name);
    if (!p) return;
    setEditingPlayerIndex(players.indexOf(p));
    setEditScoreInput(String(p.total));
    setModalEditScore(true);
  };
  const confirmEditScore = () => {
    if (editingPlayerIndex == null) return;
    const val = parseInt(editScoreInput, 10) || 0;
    setPlayers((prev) => {
      const next = [...prev];
      next[editingPlayerIndex] = { ...next[editingPlayerIndex], total: val };
      return next;
    });
    setModalEditScore(false);
  };

  const goDashboard = () => {
    setPlayers(
      Array.from(selectedNames).map((n) => ({
        name: n,
        total: 0,
        roundVotes: 0,
        resigned: false,
      }))
    );
    setMaxRounds(selectedNames.size);
    setCurrentRound(1);
    setHistory([]);
    setView("dashboard");
  };

  const renderTable = useCallback(() => {
    const sorted = [...players].sort((a, b) => b.total - a.total);
    return sorted.map((p, i) => (
      <tr key={p.name} className={p.resigned ? "opacity-50 grayscale-[0.5]" : ""}>
        <td className="py-3.5 px-1.5 text-center">{i + 1}</td>
        <td className="text-right text-[var(--white)] pr-2.5">
          {p.name} {p.resigned ? "(مستقيل)" : ""}
        </td>
        <td className="text-center">
          <span
            className="text-[var(--gold)] cursor-pointer underline decoration-dotted decoration-[var(--gold)]/40 py-1.5 px-2.5 rounded-lg transition-colors"
            onClick={() => openEditScore(p.name)}
          >
            {p.total}
          </span>
        </td>
      </tr>
    ));
  }, [players]);

  const finishRound = useCallback(() => {
    const snapshot = [...players]
      .sort((a, b) => b.total - a.total)
      .map((p) => ({ name: p.name, rv: p.roundVotes, tv: p.total }));
    setHistory((h) => [...h, { round: currentRound, data: snapshot }]);
    if (currentRound >= maxRounds) {
      setView("result");
      return;
    }
    setCurrentRound((r) => r + 1);
    setPlayers((prev) => prev.map((p) => ({ ...p, roundVotes: 0, resigned: false })));
  }, [players, currentRound, maxRounds]);

  const confirmRoundVotes = () => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.resigned) return p;
        const v = parseInt(roundInputs[p.name] || "0", 10) || 0;
        return { ...p, roundVotes: p.roundVotes + v, total: p.total + v };
      })
    );
    setModalRound(false);
    setRoundInputs({});
    finishRound();
  };

  const openRoundModal = () => {
    const init: Record<string, string> = {};
    players.filter((p) => !p.resigned).forEach((p) => (init[p.name] = ""));
    setRoundInputs(init);
    setModalRound(true);
  };

  const calcAction = (v: number, step: number) => {
    setCalcCounts((prev) => {
      const next = { ...prev };
      next[v] = Math.max(0, (next[v] || 0) + step);
      return next;
    });
  };
  useEffect(() => {
    const sum = CALC_VALS.reduce((acc, k) => acc + (calcCounts[k] || 0) * k, 0);
    setCalcSum(sum);
  }, [calcCounts]);
  const resetCalc = () => {
    const zero: Record<number, number> = {};
    CALC_VALS.forEach((v) => (zero[v] = 0));
    setCalcCounts(zero);
    setCalcSum(0);
  };
  const openCalcFor = (target: CalcTarget) => {
    setCalcTarget(target);
    setCalcShowApply(!!target);
    resetCalc();
    setModalCalc(true);
  };
  const applyCalc = () => {
    if (calcTarget?.type === "round" && calcTarget.name) {
      setRoundInputs((prev) => ({ ...prev, [calcTarget.name]: String((parseInt(prev[calcTarget.name] || "0", 10) || 0) + calcSum) }));
    }
    if (calcTarget?.type === "resign") {
      setResignVotes((prev) => String((parseInt(prev || "0", 10) || 0) + calcSum));
    }
    if (calcTarget?.type === "badel") {
      setBadelAmount((prev) => String((parseInt(prev || "0", 10) || 0) + calcSum));
    }
    if (calcTarget?.type === "council" && calcTarget.name) {
      setCouncilInputs((prev) => ({ ...prev, [calcTarget.name]: String((parseInt(prev[calcTarget.name] || "0", 10) || 0) + calcSum) }));
    }
    setModalCalc(false);
  };

  const openPenalty = () => {
    setPenaltyPlayer(null);
    setModalPenalty(true);
  };
  const confirmPenalty = () => {
    if (!penaltyPlayer) return;
    const amount = currentRound * 100;
    setPlayers((prev) =>
      prev.map((p) => (p.name === penaltyPlayer ? { ...p, total: p.total - amount } : p))
    );
    setModalPenalty(false);
  };

  const openBadel = () => {
    setBadelSelected([]);
    setBadelAmount("");
    setModalBadel(true);
  };
  const toggleBadel = (name: string) => {
    setBadelSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : prev.length < 2 ? [...prev, name] : prev
    );
  };
  const confirmBadel = () => {
    const a = parseInt(badelAmount, 10) || 0;
    setPlayers((prev) =>
      prev.map((p) =>
        badelSelected.includes(p.name)
          ? { ...p, total: p.total + a, roundVotes: p.roundVotes + a }
          : p
      )
    );
    setModalBadel(false);
  };

  const openResign = () => {
    setResignPlayer(null);
    setResignVotes("");
    setModalResign(true);
  };
  const confirmResign = () => {
    if (!resignPlayer) return;
    const v = parseInt(resignVotes, 10) || 0;
    setPlayers((prev) =>
      prev.map((p) =>
        p.name === resignPlayer
          ? { ...p, total: p.total + v, roundVotes: p.roundVotes + v, resigned: true }
          : p
      )
    );
    setModalResign(false);
  };

  const toggleCouncil = (name: string) => {
    setCouncilImmune((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const openCouncil = () => {
    setCouncilImmune(new Set());
    setCouncilInputs({});
    setModalCouncil(true);
  };
  const confirmCouncil = () => {
    Array.from(councilImmune).forEach((name) => {
      const val = parseInt(councilInputs[name] || "0", 10) || 0;
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === name ? { ...p, total: p.total + val, roundVotes: p.roundVotes + val } : p
        )
      );
    });
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.resigned || councilImmune.has(p.name)) return p;
        return { ...p, total: p.total - p.roundVotes, roundVotes: 0 };
      })
    );
    setModalCouncil(false);
    finishRound();
  };
  useEffect(() => {
    if (!modalCouncil) return;
    const init: Record<string, string> = {};
    councilImmune.forEach((name) => (init[name] = ""));
    setCouncilInputs(init);
  }, [modalCouncil, councilImmune]);

  const openHistoryModal = () => setModalHistory(true);
  const confirmReset = () => {
    if (confirm("بدء لعبة جديدة؟")) window.location.reload();
  };

  const canStart = selectedNames.size >= 3;
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);
  const firstPlace = sortedPlayers[0];

  return (
    <div className="max-w-[500px] mx-auto py-4 px-5 pb-5 w-full flex-1 relative flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <a href={MANUAL_URL} target="_blank" rel="noopener noreferrer" className={navBtn} title="القوانين">
          <IconBook />
        </a>
        <button type="button" className={navBtn} onClick={() => setModalInstall(true)}>
          <IconDownload />
        </button>
      </div>

      {/* Page: Select */}
      {view === "select" && (
        <section className="flex flex-col flex-1">
          <div className="text-center mb-8">
            <h1 className="text-center font-black text-[2.2rem] mb-1 text-[var(--gold)]">إعداد اللاعبين</h1>
            <p
              className={cn(
                "text-center mb-8 text-[0.9rem]",
                canStart ? "text-[var(--green)]" : "text-[var(--muted)]"
              )}
            >
              {canStart ? "اكتمل العدد، يمكنك البدء الآن" : "يجب اختيار 3 لاعبين على الأقل"}
            </p>
          </div>
          <div className="grid gap-2.5 grid-cols-1 flex-1">
            {savedNames.map((name) => (
              <div
                key={name}
                className={cn(cardClass, selectedNames.has(name) && cardSelected)}
                onClick={() => togglePlayer(name)}
              >
                <span>{name}</span>
                <div className="flex gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 transition text-[var(--white)]"
                    onClick={(e) => { e.stopPropagation(); openEdit(name); }}
                  >
                    <IconPencil />
                  </span>
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-[var(--red)]"
                    onClick={(e) => { e.stopPropagation(); deleteName(name); }}
                  >
                    <IconTrash />
                  </span>
                </div>
              </div>
            ))}
            <div
              className={cn(cardClass, "border border-dashed border-[var(--muted)] justify-center text-[var(--gold)]")}
              onClick={openAdd}
            >
              + أضف لاعب جديد
            </div>
          </div>
          <button
            type="button"
            className={cn(btnGold, "mt-6")}
            disabled={!canStart}
            onClick={goDashboard}
          >
            بدء التحدي
          </button>
        </section>
      )}

      {/* Page: Dashboard */}
      {view === "dashboard" && (
        <section className="flex flex-col flex-1">
          <div className="grid grid-cols-[80px_1fr_80px] items-center mb-6">
            <div className="w-[80px]" />
            <div className="text-center col-span-1">
              <h2 className="text-[var(--gold)] text-[26px] font-black m-0 whitespace-nowrap">
                {roundToText(currentRound, maxRounds === 1)}
              </h2>
              <div className="text-[var(--muted)] text-[13px] mt-0.5 font-medium">من {maxRounds} جولات</div>
            </div>
            <div className="w-[80px]" />
          </div>
          <div className="bg-black/25 rounded-[20px] p-4 border border-[var(--line)] mb-5">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-center">المركز</th>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-right">اللاعب</th>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-center">إجمالي الأصوات</th>
                </tr>
              </thead>
              <tbody>{renderTable()}</tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-4 mt-4">
            <button type="button" className={btnOutline} onClick={() => setModalBadel(true)}>
              <IconBadel />
              <span className="mr-1.5">بدل</span>
            </button>
            <button type="button" className={btnOutline} onClick={openPenalty}>
              <IconPenalty />
              <span className="mr-1.5">عقوبة</span>
            </button>
            <button type="button" className={btnOutline} onClick={openResign}>
              <IconResign />
              <span className="mr-1.5">استقالة</span>
            </button>
            <button type="button" className={btnOutline} onClick={openCouncil}>
              <IconCouncil />
              <span className="mr-1.5">رفع الجلسة</span>
            </button>
            <button type="button" className={btnOutline} onClick={() => { setCalcTarget(null); setCalcShowApply(false); resetCalc(); setModalCalc(true); }}>
              <IconCalc />
              <span className="mr-1.5">حاسبة</span>
            </button>
            <button type="button" className={btnOutline} onClick={openHistoryModal}>
              <IconHistory />
              <span className="mr-1.5">كشف النتائج</span>
            </button>
          </div>
          <button type="button" className={cn(btnGold, "mt-2.5")} onClick={openRoundModal}>
            <IconCheck />
            أصوات الجولة
          </button>
          <button
            type="button"
            className="block text-center mt-12 mb-5 text-[var(--white)] opacity-50 no-underline cursor-pointer text-[0.9rem] font-bold transition active:opacity-100 active:text-[var(--gold)]"
            onClick={confirmReset}
          >
            إعادة التعيين وبدأ لعبة جديدة
          </button>
        </section>
      )}

      {/* Page: Result */}
      {view === "result" && firstPlace && (
        <section className="flex flex-col flex-1">
          <h1 className="text-center font-black text-[2.2rem] mb-5 text-[var(--gold)]">النتائج النهائية</h1>
          <div className="text-center py-8 px-6 bg-[var(--gold)]/10 rounded-[25px] border border-[var(--gold)] mb-5">
            <div className="text-[3.5rem]">🏆</div>
            <div className="text-[var(--gold)] font-extrabold text-[1.2rem]">المتصدر الأول</div>
            <div className="text-[2.8rem] font-black my-2.5">{firstPlace.name}</div>
            <div className="opacity-80">
              بمجموع أصوات <span className="text-[var(--gold)]">{firstPlace.total}</span>
            </div>
          </div>
          <div className="bg-black/25 rounded-[20px] p-4 border border-[var(--line)] mb-5">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-center">#</th>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-right">اللاعب</th>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-center">الإجمالي</th>
                  <th className="text-[var(--gold)] text-[0.75rem] py-3 px-1.5 border-b border-[var(--line)] text-center">الفارق</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p, i) => {
                  const diffText =
                    i === 0 ? "المتصدر" : `${sortedPlayers[i - 1].total - p.total} عن ${RANK_WORDS[i - 1] || i}`;
                  return (
                    <tr key={p.name}>
                      <td className="py-3.5 px-1.5 text-center">{i + 1}</td>
                      <td className="text-right text-[var(--white)] pr-2.5">{p.name}</td>
                      <td className="text-center text-[var(--gold)]">{p.total}</td>
                      <td className="text-[0.75rem] text-[var(--muted)] font-medium text-center">{diffText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className={cn(btnOutline, "w-full mb-3 h-14")}
            onClick={openHistoryModal}
          >
            <IconHistory />
            <span className="mr-1.5">كشف الجولات</span>
          </button>
          <button type="button" className={btnGold} onClick={() => window.location.reload()}>
            لعبة جديدة
          </button>
        </section>
      )}

      {/* Modals */}
      <Dialog open={modalRound} onOpenChange={setModalRound}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalRound(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">توزيع أصوات الجولة</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--muted)]">اضف اصوات اللاعبين النهائية هذه الجولة</p>
          <div className="space-y-3">
            {players.filter((p) => !p.resigned).map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-[15px] mb-3 border border-[var(--line)]">
                <span>{p.name}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  className="flex-1 bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] p-2.5 rounded-[10px] text-center font-extrabold text-[1.2rem] min-w-0"
                  value={roundInputs[p.name] ?? ""}
                  onChange={(e) => setRoundInputs((prev) => ({ ...prev, [p.name]: e.target.value }))}
                />
                <button type="button" className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center bg-[var(--gold)]/10 border border-[var(--gold)] text-[var(--gold)] shrink-0" onClick={() => openCalcFor({ type: "round", name: p.name })}>
                  <IconCalc />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className={cn(btnGold, "mt-5")} onClick={confirmRoundVotes}>حفظ الجولة والإنتقال</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalResign} onOpenChange={setModalResign}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalResign(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">استقالة لاعب</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--muted)]">اختر اللاعب المستقيل هذه الجولة</p>
          <div className="grid gap-2.5 mb-4">
            {players.filter((p) => !p.resigned).map((p) => (
              <div
                key={p.name}
                className={cn(cardClass, resignPlayer === p.name && cardSelected)}
                onClick={() => setResignPlayer(p.name)}
              >
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-[15px] mb-3 border border-[var(--line)]">
            <span>إضافة:</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              className="flex-1 bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] p-2.5 rounded-[10px] text-center font-extrabold text-[1.2rem] min-w-0"
              value={resignVotes}
              onChange={(e) => setResignVotes(e.target.value)}
            />
            <button type="button" className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center bg-[var(--gold)]/10 border border-[var(--gold)] text-[var(--gold)] shrink-0" onClick={() => openCalcFor({ type: "resign" })}><IconCalc /></button>
          </div>
          <button type="button" className={cn(btnGold, "mt-4")} disabled={!resignPlayer} onClick={confirmResign}>تأكيد الاستقالة</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalBadel} onOpenChange={setModalBadel}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalBadel(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">بدل بين لاعبين</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--muted)]">اختر اللاعبين لتطبيق البدل</p>
          <div className="grid gap-2.5">
            {players.filter((p) => !p.resigned).map((p) => (
              <div
                key={p.name}
                className={cn(cardClass, badelSelected.includes(p.name) && cardSelected)}
                onClick={() => toggleBadel(p.name)}
              >
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          {badelSelected.length === 2 && (
            <div className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-[15px] mt-4 border border-[var(--line)]">
              <span>أصوات مضافة:</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                className="flex-1 bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] p-2.5 rounded-[10px] text-center font-extrabold text-[1.2rem] min-w-0"
                value={badelAmount}
                onChange={(e) => setBadelAmount(e.target.value)}
              />
              <button type="button" className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center bg-[var(--gold)]/10 border border-[var(--gold)] text-[var(--gold)] shrink-0" onClick={() => openCalcFor({ type: "badel" })}><IconCalc /></button>
            </div>
          )}
          <button type="button" className={cn(btnGold, "mt-4")} disabled={badelSelected.length !== 2} onClick={confirmBadel}>تأكيد البدل</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalCouncil} onOpenChange={setModalCouncil}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalCouncil(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">رفع الجلسة</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--muted)]">اختر جميع اللاعبين المحصنين من تصفيير اصوات هذه الجولة واضف اصواتهم النهائية</p>
          <div className="grid gap-2.5 mb-4">
            {players.filter((p) => !p.resigned).map((p) => (
              <div
                key={p.name}
                className={cn(cardClass, councilImmune.has(p.name) && cardSelected)}
                onClick={() => toggleCouncil(p.name)}
              >
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          {Array.from(councilImmune).map((playerName: string) => (
            <div key={playerName} className="flex items-center gap-2.5 bg-white/[0.03] p-3 rounded-[15px] mb-3 border border-[var(--line)]">
              <span>{playerName}:</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                className="flex-1 bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] p-2.5 rounded-[10px] text-center font-extrabold text-[1.2rem] min-w-0"
                value={councilInputs[playerName] ?? ""}
                onChange={(e) => setCouncilInputs((prev) => ({ ...prev, [playerName]: e.target.value }))}
              />
              <button type="button" className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center bg-[var(--gold)]/10 border border-[var(--gold)] text-[var(--gold)] shrink-0" onClick={() => openCalcFor({ type: "council", name: playerName })}><IconCalc /></button>
            </div>
          ))}
          <button type="button" className={cn(btnGold, "mt-4")} onClick={confirmCouncil}>ارفع الجلسة</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalPenalty} onOpenChange={setModalPenalty}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalPenalty(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">عقوبة</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--red)]">خصم {currentRound * 100} صوت من إجمالي اللاعب المحدد</p>
          <div className="grid gap-2.5">
            {players.filter((p) => !p.resigned).map((p) => (
              <div
                key={p.name}
                className={cn(cardClass, penaltyPlayer === p.name && cardSelected)}
                onClick={() => setPenaltyPlayer(p.name)}
              >
                <span>{p.name}</span>
              </div>
            ))}
          </div>
          <button type="button" className={cn(btnGold, "mt-4")} disabled={!penaltyPlayer} onClick={confirmPenalty}>تأكيد العقوبة</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalEditScore} onOpenChange={setModalEditScore}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalEditScore(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">تعديل إجمالي الأصوات</DialogTitle>
          <p className="text-center mb-4 font-bold text-[0.9rem] text-[var(--gold)]">
            تعديل أصوات: {editingPlayerIndex != null ? players[editingPlayerIndex]?.name : ""}
          </p>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            className="w-full bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] py-4 px-4 rounded-xl text-center font-extrabold text-[1.2rem] outline-none my-2.5"
            value={editScoreInput}
            onChange={(e) => setEditScoreInput(e.target.value)}
          />
          <button type="button" className={cn(btnGold, "mt-4")} onClick={confirmEditScore}>حفظ التعديل</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalAddPlayer} onOpenChange={setModalAddPlayer}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalAddPlayer(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">{editingOldName ? "تعديل الاسم" : "إضافة لاعب"}</DialogTitle>
          <input
            type="text"
            className="w-full bg-[var(--dark-bg)] border border-[var(--line)] text-[var(--gold)] py-4 px-4 rounded-xl text-center font-extrabold text-[1.2rem] outline-none my-2.5"
            placeholder="اسم اللاعب"
            value={addPlayerInput}
            onChange={(e) => setAddPlayerInput(e.target.value)}
          />
          <button type="button" className={cn(btnGold, "mt-4")} onClick={confirmAddPlayer}>حفظ</button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalCalc} onOpenChange={setModalCalc}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalCalc(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">الحاسبة السريعة</DialogTitle>
          <div className="bg-[var(--gold)] text-[#332b1a] py-4 px-4 rounded-[18px] text-center text-[2.2rem] font-black mb-4">{calcSum}</div>
          <div className="grid grid-cols-3 gap-4 my-6">
            {CALC_VALS.map((v) => (
              <div
                key={v}
                className="aspect-square bg-white/[0.03] border border-[var(--line)] rounded-[15px] flex items-center justify-center relative cursor-pointer"
                onClick={() => calcAction(v, 1)}
              >
                <button
                  type="button"
                  className={cn("absolute -top-2.5 -left-2.5 w-[22px] h-[22px] rounded-full bg-[#1a233a] text-[var(--red)] border-2 border-[var(--red)] text-[1.1rem] font-black leading-none pb-0.5 flex items-center justify-center", (calcCounts[v] || 0) > 0 && "flex")}
                  onClick={(e) => { e.stopPropagation(); calcAction(v, -1); }}
                >
                  −
                </button>
                {(calcCounts[v] || 0) > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[var(--gold)] text-[#332b1a] text-[0.75rem] font-extrabold border-2 border-[#1a233a] flex items-center justify-center">
                    {calcCounts[v]}
                  </span>
                )}
                <span>{v}</span>
              </div>
            ))}
          </div>
          <button type="button" className={cn(btnOutline, "w-full text-[var(--red)] border-[var(--red)]/30 mb-2.5")} onClick={resetCalc}>تصفير الحاسبة</button>
          {calcShowApply && <button type="button" className={btnGold} onClick={applyCalc}>تطبيق الرقم</button>}
        </DialogContent>
      </Dialog>

      <Dialog open={modalHistory} onOpenChange={setModalHistory}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden max-w-[450px]", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalHistory(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">كشف النتائج</DialogTitle>
          <div className="space-y-5">
            {history.length ? history.map((h) => (
              <div key={h.round} className="bg-black/25 rounded-[20px] p-4 border border-[var(--line)]">
                <div className="text-[var(--gold)] font-extrabold text-center mb-2.5">الجولة {h.round}</div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-[0.75rem] py-2 px-1.5 border-b border-[var(--line)] text-right">الاسم</th>
                      <th className="text-[0.75rem] py-2 px-1.5 border-b border-[var(--line)] text-center">أصوات الجولة</th>
                      <th className="text-[0.75rem] py-2 px-1.5 border-b border-[var(--line)] text-center text-[var(--gold)]">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.data.map((d) => (
                      <tr key={d.name}>
                        <td className="text-right text-[var(--white)] py-2 px-1.5">{d.name}</td>
                        <td className="text-center py-2 px-1.5">{d.rv}</td>
                        <td className="text-center text-[var(--gold)] py-2 px-1.5">{d.tv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )) : <p className="text-center text-[var(--muted)]">لا يوجد سجل حتى الآن</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modalInstall} onOpenChange={setModalInstall}>
        <DialogContent className={cn("border-[var(--line)] p-0 gap-0 overflow-hidden", sheetClass)}>
          <button type="button" className="absolute top-5 left-5 bg-transparent border-0 text-[var(--muted)] text-[22px] cursor-pointer" onClick={() => setModalInstall(false)}>✕</button>
          <DialogTitle className="text-center text-[var(--gold)] font-extrabold text-[1.25rem] mb-2.5">تثبيت اللعبة</DialogTitle>
          <div className="bg-white/5 p-3 rounded-xl mb-2.5 border-r-[3px] border-[var(--gold)]">للآيفون: اضغط &quot;مشاركة&quot; ثم &quot;إضافة للشاشة الرئيسية&quot;</div>
          <div className="bg-white/5 p-3 rounded-xl border-r-[3px] border-[var(--gold)]">للأندرويد: اضغط القائمة ثم &quot;تثبيت التطبيق&quot;</div>
          <button type="button" className={cn(btnGold, "mt-4")} onClick={() => setModalInstall(false)}>فهمت</button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
