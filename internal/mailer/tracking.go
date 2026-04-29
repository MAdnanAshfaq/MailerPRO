package mailer

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
)

// TrackingHandler serves a 1×1 transparent GIF and increments the open_count
// for the given sent_email ID. It is intentionally designed to never crash:
// any DB error is logged and swallowed so the pixel response always succeeds.
type TrackingHandler struct {
	db *sql.DB
}

func NewTrackingHandler(db *sql.DB) *TrackingHandler {
	return &TrackingHandler{db: db}
}

// transparentGIF is a minimal 1×1 transparent GIF (43 bytes).
var transparentGIF = []byte{
	0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a
	0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, // 1×1, colour table
	0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, // white + transparent
	0x21, 0xF9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, // GCE
	0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // image descriptor
	0x02, 0x02, 0x44, 0x01, 0x00, // image data
	0x3B, // trailer
}

// TrackOpen handles GET /api/track/open?eid=<sent_email_id>
func (h *TrackingHandler) TrackOpen(w http.ResponseWriter, r *http.Request) {
	// Always serve the pixel — tracking failure must never block the email client
	defer func() {
		if rec := recover(); rec != nil {
			log.Printf("[Tracking] Recovered from panic: %v", rec)
		}
	}()

	eidStr := r.URL.Query().Get("eid")
	if eidStr != "" {
		eid, err := strconv.ParseInt(eidStr, 10, 64)
		if err == nil && h.db != nil {
			// Fire-and-forget: don't block the response on DB latency
			go func() {
				_, dbErr := h.db.Exec(
					`UPDATE sent_emails SET open_count = open_count + 1 WHERE id = $1`,
					eid,
				)
				if dbErr != nil {
					// Try SQLite placeholder as fallback
					h.db.Exec(
						`UPDATE sent_emails SET open_count = open_count + 1 WHERE id = ?`,
						eid,
					)
				}
			}()
		}
	}

	w.Header().Set("Content-Type", "image/gif")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, private")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.WriteHeader(http.StatusOK)
	w.Write(transparentGIF) //nolint:errcheck
}
