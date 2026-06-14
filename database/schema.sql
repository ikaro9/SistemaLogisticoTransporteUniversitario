-- Sistema Logístico de Transporte Universitário

DROP TABLE IF EXISTS confirmacao CASCADE;
DROP TABLE IF EXISTS participacao CASCADE;
DROP TABLE IF EXISTS rota CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    tipo_perfil VARCHAR(20) NOT NULL CHECK (
        tipo_perfil IN ('ALUNO', 'MOTORISTA', 'ADMIN')
    ),
    instituicao VARCHAR(100)
);

CREATE TABLE rota (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150),
    descricao TEXT,
    codigo VARCHAR(20) UNIQUE,
    vagas_maximas INTEGER,

    nome_veiculo VARCHAR(100),
    cor_veiculo VARCHAR(50),
    placa_veiculo VARCHAR(20) UNIQUE,

    criador_id INTEGER,
    motorista_id INTEGER,

    FOREIGN KEY (criador_id)
        REFERENCES usuario(id),

    FOREIGN KEY (motorista_id)
        REFERENCES usuario(id)
);

CREATE TABLE participacao (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER,
    rota_id INTEGER,

    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    FOREIGN KEY (rota_id)
        REFERENCES rota(id)
        ON DELETE CASCADE,

    UNIQUE (usuario_id, rota_id)
);

CREATE TABLE confirmacao (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER,
    rota_id INTEGER,

    data_confirmacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('IDA', 'VOLTA', 'IDA_VOLTA', 'CANCELADO')),

    FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    FOREIGN KEY (rota_id)
        REFERENCES rota(id)
        ON DELETE CASCADE,

    UNIQUE (usuario_id, rota_id)
);
