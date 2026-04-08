import { useState } from "react";
import { supabase } from "./supabase.js";

const events = [
  { id: "baby-shower", label: "Baby Shower", emoji: "🍼" },
  { id: "gender-reveal", label: "Gender Reveal", emoji: "🎀" },
  { id: "bridal-shower", label: "Bridal Shower", emoji: "💍" },
  { id: "engagement", label: "Engagement Party", emoji: "🥂" },
  { id: "birthday", label: "Birthday Party", emoji: "🎂" },
  { id: "custom", label: "Create Your Own", emoji: "✨" },
];

const presetThemes = [
  { id: "pink", label: "💗 Pink", primary: "#e91e8c", bg: "linear-gradient(135deg, #fff0f6, #f3e7ff)" },
  { id: "blue", label: "💙 Blue", primary: "#1e6be9", bg: "linear-gradient(135deg, #e8f0ff, #dce7ff)" },
  { id: "red", label: "🔴 Spiderman", primary: "#cc0000", bg: "linear-gradient(135deg, #ffe8e8, #fff0e0)" },
  { id: "green", label: "💚 Green", primary: "#2e7d32", bg: "linear-gradient(135deg, #e8f5e9, #f1f8e9)" },
  { id: "gold", label: "✨ Black & Gold", primary: "#b8960c", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)" },
  { id: "purple", label: "💜 Purple", primary: "#7b1fa2", bg: "linear-gradient(135deg, #f3e5f5, #ede7f6)" },
];

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [customEventName, setCustomEventName] = useState("");
  const [screen, setScreen] = useState("home");
  const [form, setForm] = useState({ eventName: "", hostName: "", date: "", location: "", registryLink: "" });
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: "", bringing: "", familyCount: 1, rsvp: "Pending" });
  const [selectedTheme, setSelectedTheme] = useState(presetThemes[0]);
  const [customColor, setCustomColor] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareCode, setShareCode] = useState(null);
  const [eventId, setEventId] = useState(null);

  const theme = {
    primary: useCustom && customColor ? customColor : selectedTheme.primary,
    bg: useCustom && customColor ? `linear-gradient(135deg, ${customColor}22, ${customColor}11)` : selectedTheme.bg,
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleGuestChange = (e) => setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
const saveEventToSupabase = async () => {
  setSaving(true);
const code = generateCode();
  const { data, error } = await supabase.from("events").insert([{
  event_name: form.eventName,
  host_name: form.hostName,
  date: form.date,
  location: form.location,
  registry_link: form.registryLink,   // ADD THIS LINE
  event_type: selected,
  theme_color: theme.primary,
  share_code: code,
}]).select();

    if (error) {
      alert("Error saving event: " + error.message);
      setSaving(false);
      return;
    }

    setShareCode(code);
    setEventId(data[0].id);
    setSaving(false);
    setScreen("guests");
  };

  const addGuest = async () => {
    if (!newGuest.name) return;
    const guestData = {
      event_id: eventId,
      name: newGuest.name,
      bringing: newGuest.bringing,
      family_count: Number(newGuest.familyCount),
      rsvp: newGuest.rsvp,
    };

    const { error } = await supabase.from("guests").insert([guestData]);
    if (error) { alert("Error saving guest: " + error.message); return; }

    setGuests([...guests, { ...newGuest, id: Date.now() }]);
    setNewGuest({ name: "", bringing: "", familyCount: 1, rsvp: "Pending" });
  };

  const removeGuest = (id) => setGuests(guests.filter((g) => g.id !== id));
  const totalGuests = guests.reduce((sum, g) => sum + Number(g.familyCount), 0);
  const selectedEvent = events.find((e) => e.id === selected);

  const container = {
    minHeight: "100vh",
    background: theme.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    padding: "20px",
  };

  const button = {
    background: theme.primary,
    color: "white",
    border: "none",
    padding: "14px 40px",
    borderRadius: "30px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
  };
  const styles = {
  subtitle: { color: "#666", marginBottom: "24px", fontSize: "1.1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", width: "100%", maxWidth: "480px" },
  card: { background: "white", borderRadius: "16px", padding: "20px", textAlign: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  emoji: { fontSize: "2.5rem", marginBottom: "8px" },
  cardLabel: { fontWeight: "600", fontSize: "0.95rem", color: "#333" },
  formBox: { background: "white", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" },
  label: { fontWeight: "600", color: "#444", marginBottom: "6px", display: "block", marginTop: "14px" },
  input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e0e0e0", fontSize: "1rem", boxSizing: "border-box", marginBottom: "4px" },
  themeGrid: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px" },
  themeChip: { width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer" },
  backButton: { background: "none", border: "none", color: "#888", cursor: "pointer", marginTop: "12px", fontSize: "0.95rem" },
  shareBox: { background: "white", borderRadius: "16px", padding: "20px", width: "100%", maxWidth: "480px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "16px" },
  summaryBar: { display: "flex", gap: "12px", marginBottom: "16px", width: "100%", maxWidth: "480px" },
  summaryItem: { flex: 1, background: "white", borderRadius: "12px", padding: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  summaryNumber: { fontSize: "1.5rem", fontWeight: "800", display: "block" },
  summaryLabel: { fontSize: "0.75rem", color: "#888", fontWeight: "600" },
  guestCard: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  guestInfo: { flex: 1 },
  guestName: { fontWeight: "700", fontSize: "1rem", margin: "0 0 2px 0" },
  guestDetail: { color: "#666", fontSize: "0.85rem", margin: "2px 0" },
  rsvpBadge: { borderRadius: "20px", padding: "4px 12px", fontSize: "0.8rem", fontWeight: "700" },
  deleteBtn: { background: "none", border: "none", color: "#ccc", fontSize: "1.2rem", cursor: "pointer", marginLeft: "8px" },
};

  // HOME SCREEN
  if (screen === "home") {
    return (
      <div style={container}>
        <h1 style={{ fontSize: "2.5rem", color: theme.primary, marginBottom: "8px" }}>🎉 GoCelebrate</h1>
        <p style={styles.subtitle}>Plan your perfect celebration</p>
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event.id} style={{ ...styles.card, border: selected === event.id ? `3px solid ${theme.primary}` : "3px solid transparent" }} onClick={() => setSelected(event.id)}>
              <div style={styles.emoji}>{event.emoji}</div>
              <div style={styles.cardLabel}>{event.label}</div>
            </div>
          ))}
        </div>
        {selected && <button style={button} onClick={() => setScreen("details")}>Start Planning →</button>}
      </div>
    );
  }

  // DETAILS SCREEN
  if (screen === "details") {
    return (
      <div style={container}>
        <h1 style={{ fontSize: "2rem", color: theme.primary, marginBottom: "8px" }}>{selectedEvent.emoji} {selected === "custom" ? (customEventName || "Create Your Own") : selectedEvent.label}</h1>
<p style={styles.subtitle}>Tell us about your event</p>
<div style={styles.formBox}>
  {selected === "custom" && (
    <>
      <label style={styles.label}>What are you celebrating? 🎉</label>
      <input
        style={styles.input}
        placeholder="e.g. Graduation Party, Retirement, Promotion..."
        value={customEventName}
        onChange={(e) => setCustomEventName(e.target.value)}
      />
    </>
  )}
  <label style={styles.label}>Event Name</label>
          <input style={styles.input} name="eventName" placeholder="e.g. Sarah's Baby Shower" value={form.eventName} onChange={handleChange} />
          <label style={styles.label}>Host Name</label>
          <input style={styles.input} name="hostName" placeholder="e.g. Jessica" value={form.hostName} onChange={handleChange} />
          <label style={styles.label}>Date</label>
          <input style={styles.input} name="date" type="date" value={form.date} onChange={handleChange} />
          <label style={styles.label}>Location</label>
          <input style={styles.input} name="location" placeholder="e.g. 123 Main St" value={form.location} onChange={handleChange} />
          <label style={styles.label}>🎁 Registry Link (optional)</label>
<input style={styles.input} name="registryLink" placeholder="e.g. https://www.amazon.ca/baby-reg/..." value={form.registryLink} onChange={handleChange} />

          <label style={{ ...styles.label, marginTop: "20px" }}>🎨 Choose a Theme</label>
          <div style={styles.themeGrid}>
            {presetThemes.map((t) => (
              <div key={t.id} onClick={() => { setSelectedTheme(t); setUseCustom(false); }} style={{ ...styles.themeChip, background: t.primary, border: !useCustom && selectedTheme.id === t.id ? "3px solid #333" : "3px solid transparent" }} />
            ))}
          </div>

          <label style={styles.label}>🖌 Or Pick a Custom Color</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="color" value={customColor || "#e91e8c"} onChange={(e) => { setCustomColor(e.target.value); setUseCustom(true); }} style={{ width: "48px", height: "48px", border: "none", borderRadius: "10px", cursor: "pointer" }} />
            <span style={{ color: "#888", fontSize: "0.9rem" }}>{useCustom ? `Custom: ${customColor}` : "Click to use custom color"}</span>
          </div>

          <div style={{ marginTop: "16px", padding: "12px", borderRadius: "12px", background: theme.bg, textAlign: "center", color: theme.primary, fontWeight: "700" }}>
            🎉 Preview: This is your theme color!
          </div>

          <button style={button} onClick={saveEventToSupabase} disabled={saving}>
            {saving ? "Saving..." : "Next: Add Guests →"}
          </button>
          <button style={styles.backButton} onClick={() => setScreen("home")}>← Back</button>
        </div>
      </div>
    );
  }

  // GUESTS SCREEN
  if (screen === "guests") {
    return (
      <div style={container}>
        <h1 style={{ fontSize: "2rem", color: theme.primary, marginBottom: "4px" }}>{selectedEvent.emoji} Guest List</h1>
        <p style={styles.subtitle}>{form.eventName || "Your Event"}</p>

        {shareCode && (
          <div style={styles.shareBox}>
            <p style={{ margin: 0, fontWeight: "700", color: "#333" }}>🔗 Share this code with guests:</p>
            <p style={{ fontSize: "2rem", fontWeight: "900", color: theme.primary, margin: "8px 0" }}>{shareCode}</p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>Guests can use this code to find your event</p>
          </div>
        )}

    {form.registryLink && (
  <div style={styles.shareBox}>
    <p style={{ margin: 0, fontWeight: "700", color: "#333" }}>🎁 Registry</p>
    <a href={form.registryLink} target="_blank" rel="noopener noreferrer" style={{ color: theme.primary, fontWeight: "700", fontSize: "1rem", wordBreak: "break-all" }}>View Registry →</a>
  </div>

)}

<div style={styles.summaryBar}>
          <div style={styles.summaryItem}>
            <span style={{ ...styles.summaryNumber, color: theme.primary }}>{guests.length}</span>
            <span style={styles.summaryLabel}>Guests</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={{ ...styles.summaryNumber, color: theme.primary }}>{totalGuests}</span>
            <span style={styles.summaryLabel}>Total Attending</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={{ ...styles.summaryNumber, color: theme.primary }}>{guests.filter((g) => g.rsvp === "Yes").length}</span>
            <span style={styles.summaryLabel}>Confirmed</span>
          </div>
        </div>

        <div style={styles.formBox}>
          <p style={{ fontWeight: "700", color: theme.primary, marginBottom: "12px" }}>➕ Add a Guest</p>
          <label style={styles.label}>Guest Name</label>
          <input style={styles.input} name="name" placeholder="e.g. Amanda" value={newGuest.name} onChange={handleGuestChange} />
          <label style={styles.label}>What are they bringing?</label>
          <input style={styles.input} name="bringing" placeholder="e.g. Pasta salad, Gift" value={newGuest.bringing} onChange={handleGuestChange} />
          <label style={styles.label}>Family Members Coming</label>
          <input style={styles.input} name="familyCount" type="number" min="1" value={newGuest.familyCount} onChange={handleGuestChange} />
          <label style={styles.label}>RSVP Status</label>
          <select style={styles.input} name="rsvp" value={newGuest.rsvp} onChange={handleGuestChange}>
            <option>Pending</option>
            <option>Yes</option>
            <option>No</option>
            <option>Maybe</option>
          </select>
          <button style={button} onClick={addGuest}>Add Guest ✓</button>
        </div>

        {guests.length > 0 && (
          <div style={{ width: "100%", maxWidth: "480px", marginTop: "20px" }}>
            {guests.map((guest) => (
              <div key={guest.id} style={styles.guestCard}>
                <div style={styles.guestInfo}>
                  <p style={styles.guestName}>{guest.name}</p>
                  <p style={styles.guestDetail}>🍽 {guest.bringing || "Nothing listed"}</p>
                  <p style={styles.guestDetail}>👨‍👩‍👧 {guest.familyCount} attending</p>
                  <span style={{ ...styles.rsvpBadge, background: guest.rsvp === "Yes" ? "#d4edda" : guest.rsvp === "No" ? "#f8d7da" : "#fff3cd", color: guest.rsvp === "Yes" ? "#155724" : guest.rsvp === "No" ? "#721c24" : "#856404" }}>{guest.rsvp}</span>
                </div>
                <button style={styles.deleteBtn} onClick={() => removeGuest(guest.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <button style={styles.backButton} onClick={() => setScreen("details")}>← Back</button>
      </div>
    );
  }
}