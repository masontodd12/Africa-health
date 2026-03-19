"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight:"100vh", background:"#050A14", display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ maxWidth:400, textAlign:"center" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", margin:"0 auto 1.5rem" }}>⚠</div>
          <h2 style={{ fontSize:"1.2rem", fontWeight:700, color:"white", marginBottom:"0.75rem" }}>Something went wrong</h2>
          <p style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.4)", lineHeight:1.7, marginBottom:"1.5rem" }}>
            The app encountered an unexpected error. Your data has not been saved.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ background:"#4299E1", border:"none", borderRadius:10, padding:"0.85rem 2rem", fontSize:"0.95rem", fontWeight:700, color:"white", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}
          >
            Reload app
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre style={{ marginTop:"1.5rem", fontSize:"0.72rem", color:"rgba(255,255,255,0.25)", textAlign:"left", whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
