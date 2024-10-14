"use client"; // Marcar como Client Component

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [markers, setMarkers] = useState([]); // Armazena os marcadores
  const [newMarker, setNewMarker] = useState(null); // Armazena o ponto antes de ser nomeado
  const [pointName, setPointName] = useState(""); // Armazena o nome do ponto
  const [hoveredMarker, setHoveredMarker] = useState(null); // Armazena o marcador que está sendo "hovered"
  const [showAllTooltips, setShowAllTooltips] = useState(false); // Controle para exibir ou ocultar todos os tooltips
  const imgRef = useRef(null); // Referência para a imagem
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 }); // Dimensões da imagem

  // Função para capturar o clique na imagem e adicionar um marcador temporário
  const handleImageClick = (event) => {
    const img = imgRef.current;
    const rect = img.getBoundingClientRect(); // Dimensões visíveis da imagem
    const x = event.clientX - rect.left; // Coordenada X em relação à imagem
    const y = event.clientY - rect.top; // Coordenada Y em relação à imagem

    // Armazena o novo marcador temporário com coordenadas percentuais
    setNewMarker({ x, y, width: rect.width, height: rect.height });
  };

  // Adicionar o marcador com nome à lista
  const addMarker = () => {
    if (newMarker && pointName.trim() !== "") {
      setMarkers([...markers, { ...newMarker, name: pointName }]); // Adiciona o nome ao ponto
      setNewMarker(null); // Limpa o marcador temporário
      setPointName(""); // Limpa o nome do ponto
    } else {
      alert(
        "Clique na imagem para marcar um ponto e insira um nome para o ponto."
      );
    }
  };

  // Atualizar as dimensões da imagem quando a janela for redimensionada
  const updateImageDimensions = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect(); // Dimensões visíveis atuais da imagem
      setImgDimensions({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    // Atualiza as dimensões da imagem ao carregar a página e ao redimensionar a janela
    window.addEventListener("resize", updateImageDimensions);
    updateImageDimensions(); // Chama a função ao carregar
    return () => window.removeEventListener("resize", updateImageDimensions); // Limpa o evento ao desmontar
  }, []);

  // Função para alternar a visibilidade de todos os tooltips
  const toggleTooltips = () => {
    setShowAllTooltips(!showAllTooltips);
  };

  // Renderizar os marcadores com base nas novas dimensões da imagem
  const renderMarkers = () => {
    if (!imgDimensions.width || !imgDimensions.height) return null; // Se as dimensões não forem definidas, não renderiza

    return markers.map((marker, index) => {
      // Calcula a nova posição proporcional ao tamanho da imagem redimensionada
      const newX = (marker.x / marker.width) * imgDimensions.width;
      const newY = (marker.y / marker.height) * imgDimensions.height;

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${newY}px`,
            left: `${newX}px`,
            backgroundColor: "red",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)", // Centraliza o marcador
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoveredMarker(marker)} // Exibe o tooltip ao passar o mouse
          onMouseLeave={() => setHoveredMarker(null)} // Remove o tooltip ao sair do ponto
        />
      );
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Marcar pontos na imagem</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Nome do ponto"
          value={pointName}
          onChange={(e) => setPointName(e.target.value)} // Atualiza o nome do ponto
          style={{ padding: "5px", width: "200px" }}
        />
        <button
          onClick={addMarker}
          style={{ padding: "5px", marginLeft: "10px" }}
        >
          Adicionar Ponto
        </button>
        <button
          onClick={toggleTooltips}
          style={{ padding: "5px", marginLeft: "10px" }}
        >
          {showAllTooltips ? "Ocultar Tooltips" : "Exibir Tooltips"}
        </button>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Imagem onde os marcadores serão adicionados */}
        <img
          ref={imgRef} // Referência para a imagem
          src="https://firebasestorage.googleapis.com/v0/b/simpplify-15797.appspot.com/o/TAG%2Ffba96d45-fce4-4500-a6bf-340d8b1353be.jpeg?alt=media&token=fba96d45-fce4-4500-a6bf-340d8b1353be" // Substitua pela URL da sua imagem
          alt="Imagem para marcação"
          style={{ maxWidth: "100%", height: "auto" }} // A imagem vai ajustar automaticamente com a tela
          onClick={handleImageClick} // Função para capturar o clique
        />
        {renderMarkers()} {/* Renderiza os marcadores */}
        {/* Mostra um ponto temporário antes de ser nomeado */}
        {newMarker && (
          <div
            style={{
              position: "absolute",
              top: `${
                (newMarker.y / newMarker.height) * imgDimensions.height
              }px`,
              left: `${
                (newMarker.x / newMarker.width) * imgDimensions.width
              }px`,
              backgroundColor: "blue",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)", // Centraliza o marcador
            }}
          />
        )}
        {/* Tooltip para mostrar o nome do ponto ao passar o mouse ou ao exibir todos */}
        {markers.map((marker, index) => {
          const newX = (marker.x / marker.width) * imgDimensions.width;
          const newY = (marker.y / marker.height) * imgDimensions.height;

          if (hoveredMarker === marker || showAllTooltips) {
            return (
              <div
                key={`tooltip-${index}`}
                style={{
                  position: "absolute",
                  top: `${newY}px`,
                  left: `${newX}px`,
                  backgroundColor: "black",
                  color: "white",
                  padding: "5px",
                  borderRadius: "5px",
                  transform: "translate(-50%, -120%)", // Posiciona o tooltip acima do ponto
                  whiteSpace: "nowrap",
                }}
              >
                {marker.name}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Lista dos pontos criados */}
      <div style={{ marginTop: "20px" }}>
        <h2>Pontos Marcados:</h2>
        <ul>
          {markers.map((marker, index) => (
            <li key={index}>
              {index + 1}. {marker.name} (X: {marker.x.toFixed(2)}, Y:{" "}
              {marker.y.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
