# Predicción de churn en telecomunicaciones

[Read in English](README.md)

Entrega final del curso Data Science I de Coderhouse. Es un análisis exploratorio y dos modelos de clasificación para predecir si un cliente de una empresa de telecomunicaciones se da de baja o se queda.

## El problema

Una empresa de telecomunicaciones pierde clientes todos los meses, y retener a uno cuesta menos que conseguir uno nuevo. La pregunta del proyecto es si se puede predecir la baja a partir del contrato y los servicios que tiene el cliente, y qué factores se relacionan más con que se vaya.

## Los datos

Uso el dataset público Telco Customer Churn: 7.043 clientes y 21 columnas con datos del cliente, servicios contratados, tipo de contrato, cargos y la variable objetivo `Churn`. El 26,5% de los clientes se dio de baja, así que las clases están desbalanceadas. El CSV no está en el repo; las instrucciones para bajarlo están en [`data/README.md`](data/README.md).

## Qué hice

1. **Limpieza.** `TotalCharges` venía como texto. La pasé a numérico y rellené con 0 los 11 clientes nuevos (`tenure = 0`) que todavía no tenían nada facturado. No había duplicados ni otros nulos.
2. **Análisis exploratorio.** Distribuciones, boxplots, violines, correlaciones y la relación de cada variable con el churn.
3. **Preprocesamiento.** Elegí cuatro variables: `Contract`, `InternetService`, `tenure` y `MonthlyCharges`. Codifiqué las categóricas con one-hot, escalé las numéricas con `StandardScaler` (ajustado solo con train, para no filtrar datos del test) y dividí 80/20.
4. **Modelos.** Random Forest y Regresión Logística, los dos con `class_weight="balanced"`. Comparé con recall, precision y F1, porque la accuracy engaña cuando una clase pesa tres veces más que la otra: un modelo que siempre diga "no se va" ya acierta el 73,5%.

## Lo que encontré

- Con contrato mensual se va cerca del 43% de los clientes. Con contrato de un año, el 11%, y con uno de dos años, el 3%.
- Con fibra óptica se va cerca del 42%, contra 19% con DSL y 7% sin internet.
- La mitad de los clientes que se fueron lo hizo antes de los 10 meses. Los que se quedan tienen una antigüedad mediana de 38 meses.
- Los que se van pagan, en promedio, un cargo mensual más alto.

![Churn según contrato, internet, antigüedad y cargo mensual](images/churn_drivers.png)

## Resultados en el set de prueba

| Modelo | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Random Forest | 0,749 | 0,516 | 0,855 | 0,644 |
| Regresión Logística | 0,738 | 0,503 | 0,836 | 0,628 |

Elegí el Random Forest porque detecta un poco más de clientes en riesgo: 319 de los 373 que efectivamente se fueron. A cambio, cerca de la mitad de sus alertas son falsas alarmas, así que una acción de retención tendría que ser de bajo costo. El AUC del Random Forest es 0,858. Que dos modelos distintos den resultados tan parecidos sugiere que el límite está en las cuatro variables usadas más que en el modelo.

![Matriz de confusión del Random Forest](images/confusion_matrix_rf.png)

![Curva ROC del Random Forest](images/roc_curve_rf.png)

## Limitaciones

- Solo usé cuatro variables. Servicios como soporte técnico o seguridad online, o el método de pago, podrían mejorar el resultado.
- Probé una sola división train/test, así que los números podrían cambiar un poco con otra.
- No tengo el costo de una campaña de retención ni el valor de cada cliente, que harían falta para estimar cuánto ganaría la empresa.
- Los datos son de un momento puntual: muestran relaciones, no causas.

## Estructura del repo

```
telco-churn-prediction/
├── notebooks/
│   └── churn_telecomunicaciones.ipynb
├── data/
│   └── README.md          # de dónde bajar el CSV
├── images/                # gráficos que se usan en este README
├── requirements.txt
└── README.md
```

## Cómo correrlo

Necesitás Python 3 y las librerías de `requirements.txt` (pandas, numpy, matplotlib, seaborn y scikit-learn).

1. Cloná el repo e instalá las dependencias: `pip install -r requirements.txt`.
2. Bajá el dataset `WA_Fn-UseC_-Telco-Customer-Churn.csv` (ver `data/README.md`) y dejalo en la carpeta `data/`.
3. Abrí `notebooks/churn_telecomunicaciones.ipynb` y ejecutá las celdas en orden.

Si lo corrés en Google Colab, subí el CSV directo a la sesión o a tu Drive: el notebook busca el archivo en esos lugares.

## Autor

Ignacio Sortino
