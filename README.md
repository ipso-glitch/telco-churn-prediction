# Telecom customer churn prediction

Final project for the Data Science I course at Coderhouse. It is an exploratory analysis plus two classification models that predict whether a customer of a telecom company leaves or stays.

## The problem

A telecom company loses customers every month, and keeping one costs less than winning a new one. The project asks whether a cancellation can be predicted from the customer's contract and services, and which factors are most related to leaving.

## The data

I use the public Telco Customer Churn dataset: 7,043 customers and 21 columns covering customer details, contracted services, contract type, charges, and the target variable `Churn`. 26.5% of customers left, so the classes are imbalanced. The CSV is not in the repo; see [`data/README.md`](data/README.md) for how to download it.

## What I did

1. **Cleaning.** `TotalCharges` came as text. I converted it to numeric and filled the 11 new customers (`tenure = 0`) with 0, since nothing had been billed to them yet. There were no duplicates or other missing values.
2. **Exploratory analysis.** Distributions, boxplots, violin plots, correlations, and how each variable relates to churn.
3. **Preprocessing.** I picked four features: `Contract`, `InternetService`, `tenure`, and `MonthlyCharges`. Categorical variables are one-hot encoded, numeric ones are scaled with `StandardScaler` (fitted on the training set only, to avoid leaking test data), and the split is 80/20.
4. **Models.** Random Forest and Logistic Regression, both with `class_weight="balanced"`. I compared them with recall, precision, and F1, because accuracy is misleading when one class is almost three times larger than the other: a model that always says "stays" is already right 73.5% of the time.

## Findings

- About 43% of customers on a month-to-month contract leave. With a one-year contract it is 11%, and with a two-year contract, 3%.
- About 42% of fiber optic customers leave, against 19% with DSL and 7% with no internet.
- Half of the customers who left did so before month 10. Those who stay have a median tenure of 38 months.
- Customers who leave pay a higher monthly charge on average.

![Churn by contract, internet service, tenure, and monthly charge](images/churn_drivers.png)

## Results on the test set

| Model | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Random Forest | 0.749 | 0.516 | 0.855 | 0.644 |
| Logistic Regression | 0.738 | 0.503 | 0.836 | 0.628 |

I chose the Random Forest because it catches slightly more at-risk customers: 319 of the 373 who actually left. The trade-off is that about half of its alerts are false alarms, so a retention action would need to be cheap. The Random Forest AUC is 0.858. The two models give very similar results, which suggests the limit is the four features used rather than the model.

![Random Forest confusion matrix](images/confusion_matrix_rf.png)

![Random Forest ROC curve](images/roc_curve_rf.png)

## Limitations

- I used only four features. Services like tech support or online security, or the payment method, could improve the result.
- I tried a single train/test split, so the numbers could change a little with another one.
- I don't have the cost of a retention campaign or the value of each customer, both needed to estimate how much the company would gain.
- The data is a snapshot: it shows relationships, not causes.

## Repo structure

```
telco-churn-prediction/
├── notebooks/
│   └── churn_telecomunicaciones.ipynb
├── data/
│   └── README.md          # where to download the CSV
├── images/                # charts used in this README
├── requirements.txt
└── README.md
```

## How to run it

You need Python 3 and the libraries in `requirements.txt` (pandas, numpy, matplotlib, seaborn, and scikit-learn). The notebook itself is written in Spanish.

1. Clone the repo and install the dependencies: `pip install -r requirements.txt`.
2. Download the dataset `WA_Fn-UseC_-Telco-Customer-Churn.csv` (see `data/README.md`) and put it in the `data/` folder.
3. Open `notebooks/churn_telecomunicaciones.ipynb` and run the cells in order.

If you run it in Google Colab, upload the CSV to the session or to your Drive: the notebook looks for the file in both places.

## Author

Ignacio Sortino
