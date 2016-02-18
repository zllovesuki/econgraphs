/// <reference path="../../../eg.ts"/>

module EconGraphs {

    export interface SlutskyDefinition extends KG.ModelDefinition
    {
        utility: {type: string; definition: TwoGoodUtilityDefinition};
        px: any;
        py: any;
        px2?: any;
        py2?: any;
        income: any;

        // determined programmatically
        budget1: {type: string, definition: SimpleBudgetConstraintDefinition};
        budget2: {type: string, definition: SimpleBudgetConstraintDefinition};
        decompositionBudget: {type: string, definition: SimpleBudgetConstraintDefinition};
        compensatedBudget: {type: string, definition: SimpleBudgetConstraintDefinition};
        marshallianDemand1: {type: string, definition: MarshallianDemandDefinition};
        marshallianDemand2: {type: string, definition: MarshallianDemandDefinition};
        hicksianDemand1: {type: string, definition: HicksianDemandDefinition};
        hicksianDemand2: {type: string, definition: HicksianDemandDefinition};
    }

    export interface ISlutsky extends KG.IModel
    {
        utility: TwoGoodUtility;
        utilitySelector: KG.Selector;

        budget1: SimpleBudgetConstraint;
        budget2: SimpleBudgetConstraint;
        decompositionBudget: SimpleBudgetConstraint;
        compensatedBudget: SimpleBudgetConstraint;

        initialBundle: KG.ICoordinates;
        finalBundle: KG.ICoordinates;
        decompositionBundle: KG.ICoordinates;
        compensatedBundle: KG.ICoordinates;
        initialUtility: number;
        finalUtility: number;
        initialIndifferenceCurve: KGMath.Functions.Base;
        finalIndifferenceCurve: KGMath.Functions.Base;

        marshallianDemand1: MarshallianDemand;
        marshallianDemand2: MarshallianDemand;
        hicksianDemand1: HicksianDemand;
        hicksianDemand2: HicksianDemand;

    }

    export class Slutsky extends KG.Model implements ISlutsky
    {
        public utility;
        public utilitySelector;
        public budget1: SimpleBudgetConstraint;
        public budget2: SimpleBudgetConstraint;
        public decompositionBudget: SimpleBudgetConstraint;
        public compensatedBudget: SimpleBudgetConstraint;

        public initialBundle: KG.ICoordinates;
        public finalBundle: KG.ICoordinates;
        public decompositionBundle: KG.ICoordinates;
        public compensatedBundle: KG.ICoordinates;
        public initialUtility: number;
        public finalUtility: number;
        public initialIndifferenceCurve: KGMath.Functions.Base;
        public finalIndifferenceCurve: KGMath.Functions.Base;

        public marshallianDemand1: MarshallianDemand;
        public marshallianDemand2: MarshallianDemand;
        public hicksianDemand1: HicksianDemand;
        public hicksianDemand2: HicksianDemand;

        constructor(definition:SlutskyDefinition,modelPath?:string) {

            definition.px2 = definition.px2 || definition.px;
            definition.py2 = definition.py2 || definition.py;

            definition.budget1 = {
                type: 'EconGraphs.SimpleBudgetConstraint',
                definition: {
                    income: definition.income,
                    px: definition.px,
                    py: definition.py
                }
            };

            definition.budget2 = {
                type: 'EconGraphs.SimpleBudgetConstraint',
                definition: {
                    income: definition.income,
                    px: definition.px2,
                    py: definition.py2
                }
            };

            definition.decompositionBudget = {
                type: 'EconGraphs.SimpleBudgetConstraint',
                definition: {
                    px: definition.px2,
                    py: definition.py2
                }
            };

            definition.compensatedBudget = {
                type: 'EconGraphs.SimpleBudgetConstraint',
                definition: {
                    income: 0,
                    px: definition.px,
                    py: definition.py
                }
            };

            definition.marshallianDemand1 = {
                type: 'EconGraphs.MarshallianDemand',
                definition: {
                    utility: definition.utility,
                    budget: definition.budget1,
                    snapToOptimalBundle: true
                }
            };

            definition.marshallianDemand2 = {
                type: 'EconGraphs.MarshallianDemand',
                definition: {
                    utility: definition.utility,
                    budget: definition.budget2,
                    snapToOptimalBundle: true
                }
            };

            definition.hicksianDemand1 = {
                type: 'EconGraphs.HicksianDemand',
                definition: {
                    utility: definition.utility,
                    utilityConstraintDef: {
                        px: definition.px2,
                        py: definition.py2
                    },
                    snapToOptimalBundle: true
                }
            };

            definition.hicksianDemand2 = {
                type: 'EconGraphs.HicksianDemand',
                definition: {
                    utility: definition.utility,
                    utilityConstraintDef: {
                        px: definition.px,
                        py: definition.py
                    },
                    snapToOptimalBundle: true
                }
            };

            super(definition,modelPath);
        }

        _update(scope) {
            var s = this;

            s.marshallianDemand1.utility = s.utility;
                s.marshallianDemand2.utility = s.utility;
                s.hicksianDemand1.utility = s.utility;
                s.hicksianDemand2.utility = s.utility;


            s.marshallianDemand1.update(scope);
            s.marshallianDemand2.update(scope);

            s.initialBundle = s.marshallianDemand1.bundle;
            s.finalBundle = s.marshallianDemand2.bundle;

            //console.log('initialBundle = ',s.initialBundle);

            s.initialUtility = s.utility.utility(s.initialBundle);
            s.finalUtility = s.utility.utility(s.finalBundle);

            s.hicksianDemand1.utilityConstraint.u = s.initialUtility;
            s.hicksianDemand2.utilityConstraint.u = s.finalUtility;

            s.decompositionBundle = s.utility.lowestCostBundle(s.hicksianDemand1.utilityConstraint);
            s.compensatedBundle = s.utility.lowestCostBundle(s.hicksianDemand2.utilityConstraint);

            //console.log('decompositionBundle = (',s.decompositionBundle.x,',',s.decompositionBundle.y,')')

            s.decompositionBudget.setIncome(s.budget2.px*s.decompositionBundle.x + s.budget2.py*s.decompositionBundle.y);
            s.compensatedBudget.setIncome(s.budget1.px*s.compensatedBundle.x + s.budget1.py*s.compensatedBundle.y);

            s.initialIndifferenceCurve = s.utility.indifferenceCurveAtUtilityFn(s.initialUtility);
            s.finalIndifferenceCurve = s.utility.indifferenceCurveAtUtilityFn(s.finalUtility);

            //console.log(s);

            return s;
        }

    }

}