import { useState, useRef, useEffect } from "react";
import "./TagInput.css";

const LIMITE_TAGS = 10;
const MIN_CHARS = 2;
const MAX_CHARS = 25;

const InputTags = ({ tags, onAddTag, onRemoveTag, tagsDoSistema = [], tagsSelecionadas = [], onToggleTagSistema }) => {
    const [editando, setEditando] = useState(false);
    const [texto, setTexto] = useState("");
    const inputRef = useRef(null);

    const totalSelecionadas = tags.length + tagsSelecionadas.length;
    const limiteAtingido = totalSelecionadas >= LIMITE_TAGS;

    useEffect(() => {
        if (editando && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editando]);

    const ativarEdicao = () => {
        if (!limiteAtingido) setEditando(true);
    };

    const tentarAdicionarTag = () => {
        const tagLimpa = texto.trim().toLowerCase();

        if (
            tagLimpa.length >= MIN_CHARS &&
            tagLimpa.length <= MAX_CHARS &&
            !tags.includes(tagLimpa) &&
            !tagsDoSistema.includes(tagLimpa)
        ) {
            onAddTag(tagLimpa);
        }

        setTexto("");
        setEditando(false);
    };

    const aoApertarTecla = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            tentarAdicionarTag();
        }
        if (e.key === "Escape") {
            setTexto("");
            setEditando(false);
        }
    };

    const aoMudarTexto = (e) => {
        const valor = e.target.value;

        if (valor.endsWith(",")) {
            setTexto(valor.slice(0, -1));
            tentarAdicionarTag();
            return;
        }

        if (valor.length <= MAX_CHARS) {
            setTexto(valor);
        }
    };

    return (
        <div className="input-tags-wrapper">
            <div className="input-tags-lista">

                {tagsDoSistema.map((tag) => {
                    const selecionada = tagsSelecionadas.includes(tag);
                    return (
                        <span
                            key={tag}
                            className={`tag-item ${selecionada ? "tag-item--ativa" : ""}`}
                            onClick={() => (!limiteAtingido || selecionada) ? onToggleTagSistema(tag) : undefined}
                        >
                            <span className={`tag-item-texto ${selecionada ? "tag-item-texto--ativa" : ""}`}>
                                {tag}
                            </span>
                        </span>
                    );
                })}

                {tags.map((tag) => (
                    <span key={tag} className="tag-item tag-item--ativa">
                        <span className="tag-item-texto tag-item-texto--ativa">{tag}</span>
                        <button
                            type="button"
                            className="tag-item-remover"
                            onClick={() => onRemoveTag(tag)}
                            aria-label={`Remover tag ${tag}`}
                        >
                            ✕
                        </button>
                    </span>
                ))}

                {!limiteAtingido && (
                    <span
                        className={`tag-nova ${editando ? "tag-nova--editando" : ""}`}
                        onClick={!editando ? ativarEdicao : undefined}
                    >
                        {editando && (
                            <span className="tag-nova-fantasma" aria-hidden="true">
                                {texto || ""}
                            </span>
                        )}

                        {editando ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={texto}
                                onChange={aoMudarTexto}
                                onKeyDown={aoApertarTecla}
                                onBlur={tentarAdicionarTag}
                                className="tag-nova-input"
                                maxLength={MAX_CHARS}
                            />
                        ) : (
                            <span className="tag-nova-label">Nova Tag +</span>
                        )}
                    </span>
                )}

                {limiteAtingido && (
                    <span className="tag-aviso">Limite de 10 tags atingido</span>
                )}
            </div>
        </div>
    );
};

export default InputTags;