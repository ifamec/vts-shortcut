

interface ExpressionGridProps {
  expressions: any[];
  toggledExpressions: Record<string, boolean>;
  toggleExpression: (file: string, currentlyActive: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ExpressionGrid({ expressions, toggledExpressions, toggleExpression }: ExpressionGridProps) {
  return (
    <div className="grid">
      {expressions.map((exp) => {
        const isToggled = toggledExpressions[exp.file];
        return (
          <button 
            key={exp.file} 
            className={`hotkey-card ${isToggled ? 'toggled' : ''}`}
            onClick={(e) => toggleExpression(exp.file, isToggled, e)}
          >
            <div className="hotkey-content">
              <span className="hotkey-name">{exp.name || exp.file.replace('.exp3.json', '')}</span>
              <span className="hotkey-type">Expression</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
