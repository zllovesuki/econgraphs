/// <reference path="../../../eg.ts"/>

'use strict';

module EconGraphs {

    export interface TwoGoodBundle extends KG.ICoordinates {

    }

    export interface TwoGoodUtilityDefinition extends UtilityDefinition {

    }

    export interface ITwoGoodUtility extends IUtility {

        title: string;
        formula: (values:boolean) => string;

        muxFunction: KGMath.Functions.Base;
        muyFunction: KGMath.Functions.Base;

        utility:(bundle?:TwoGoodBundle) => number;
        mux:(bundle?:TwoGoodBundle) => number;
        muy:(bundle?:TwoGoodBundle) => number;
        mrs:(bundle?:TwoGoodBundle) => number;

        bundlePoint: (bundle: TwoGoodBundle, params?: KG.PointParamsDefinition) => KG.Point;

        indifferenceCurveAtUtility: (utility:number, params?: KG.ViewObjectParamsDefinition) => KG.ViewObject;
        indifferenceCurveThroughBundle: (bundle:TwoGoodBundle, params?: KG.ViewObjectParamsDefinition) => KG.ViewObject;
        indifferenceCurveFamily: (levels: number[], params?: KG.ViewObjectParamsDefinition) => KG.ViewObjectGroup;

        mrsLine: (bundle:TwoGoodBundle, params?: KG.LineParamsDefinition) => KG.Line;

        //preferredToBundleArea: (bundle:TwoGoodBundle) => KG.Area;
        //dispreferredToBundleArea: (bundle:TwoGoodBundle) => KG.Area;
        //higherUtilityArea: (utility:number) => KG.Area;
        //lowerUtilityArea: (utility:number) => KG.Area;

        _unconstrainedOptimalX:(budgetSegment:BudgetSegment) => number;
        optimalBundle:(budget:BudgetConstraint) => KG.ICoordinates;
        optimalBundleAlongSegment:(budgetSegment:BudgetSegment) => KG.ICoordinates;
        optimalBundlePoint: (budget: BudgetConstraint, params?: KG.PointParamsDefinition) => KG.Point;
        optimalIndifferenceCurve: (budget: BudgetConstraint, params?: KG.ViewObjectParamsDefinition) => KG.ViewObject;
        indirectUtility: (budget: BudgetConstraint) => number;

        lowestCostBundle: (utility:UtilityConstraint) => KG.ICoordinates;
        lowestCostBundlePoint: (utility:UtilityConstraint, params?: KG.PointParamsDefinition) => KG.Point;
        expenditure: (utility:UtilityConstraint) => number;

    }

    export class TwoGoodUtility extends Utility implements ITwoGoodUtility {

        public title;
        public muxFunction;
        public muyFunction;

        constructor(definition:TwoGoodUtilityDefinition, modelPath?:string) {

            definition = _.defaults(definition, {
                indifferenceCurveLabel: 'U'
            });
            super(definition, modelPath);

            var u = this;
            u.muxFunction = u.utilityFunction.derivative(1);
            u.muyFunction = u.utilityFunction.derivative(2);

        }

        _update(scope) {
            var u = this;
            u.utilityFunction.update(scope);
            u.muxFunction.update(scope);
            u.muyFunction.update(scope);
            console.log('updated utility function to ',u);
            return u;
        }

        /* Pure preferences */

        // Given two bundles, evaluates whether agent prefers first or second, or is indifferent
        bundlePreferred(bundles:TwoGoodBundle[], tolerance?:number) {

            var u = this;

            tolerance = tolerance || 0.01; // percent difference within which one is thought to be indifferent


            var u1 = u.utility(bundles[0]),
                u2 = u.utility(bundles[1]),
                percentUilityDifference = (u2 - u1) / (0.5 * (u1 + u2));

            if (percentUilityDifference > tolerance) {
                return 2; //second bundle preferred
            }

            if (percentUilityDifference < -tolerance) {
                return 1; //first bundle preferred
            }

            return 0; //indifferent between two bundles

        }

        /* Utility measures */

        utility(bundle:TwoGoodBundle) {
            return this.utilityFunction.value(KG.getBases(bundle));
        }

        mux(bundle:TwoGoodBundle) {
            return this.muxFunction.value(KG.getBases(bundle));
        }

        muy(bundle:TwoGoodBundle) {
            return this.muyFunction.value(KG.getBases(bundle));
        }

        mrs(bundle:TwoGoodBundle) {
            return this.mux(bundle) / this.muy(bundle);
        }
        /* Indifference curves */

        indifferenceCurveAtUtilityFn(utility:number) {
            var u = this;
            var clone = _.clone(u.utilityFunction);
            clone.setLevel(utility);
            return clone;
        }

        indifferenceCurveThroughBundleFn(bundle:TwoGoodBundle) {
            var u = this,
                utility = u.utility(bundle);
            return u.indifferenceCurveAtUtilityFn(utility);
        }

        /* Utility maximization subject to a budget constraint */

        _unconstrainedOptimalX(budgetSegment:BudgetSegment) {
            return 0; // based on specific utility function; overridden by subclass
        }

        optimalBundle(budget:BudgetConstraint) {
            var u = this;
            var candidateBundles: TwoGoodBundle[] = budget.budgetSegments.map(function(segment) { return u.optimalBundleAlongSegment(segment)});
            var maxUtilityBundle = candidateBundles[0];
            candidateBundles.forEach(function(bundle) {
                if(u.utility(bundle) > u.utility(maxUtilityBundle)) {
                    maxUtilityBundle = bundle;
                }
            });
            return maxUtilityBundle;
        }

        optimalBundleAlongSegment(budgetSegment:BudgetSegment) {
            var u = this;
            var constrainedX, unconstrainedX;
            unconstrainedX = u._unconstrainedOptimalX(budgetSegment);
            constrainedX = budgetSegment.xDomain.closestValueTo(unconstrainedX);
            return {x: constrainedX, y: budgetSegment.linear.yValue(constrainedX)};
        }

        optimalBundlePoint(budget:BudgetConstraint, params:KG.PointParamsDefinition) {
            var optimalBundle = this.optimalBundle(budget);
            params.name = params.name || 'optimal';
            return this.bundlePoint(optimalBundle,params)
        }

        optimalIndifferenceCurve(budget:BudgetConstraint, params:KG.CurveParamsDefinition) {
            var optimalBundle = this.optimalBundle(budget);
            return this.indifferenceCurveThroughBundle(optimalBundle,params);
        }

        indirectUtility(budget:BudgetConstraint) {
            var u = this;
            return u.utility(u.optimalBundle(budget));
        }

        /* Cost minimization */

        lowestCostBundle(utility:UtilityConstraint) {
            return {x: null, y: null}; // based on specific utility function; overridden by subclass
        }

        lowestCostBundlePoint(utility:UtilityConstraint, params:KG.PointParamsDefinition) {
            var lowestCostBundle = this.lowestCostBundle(utility);
            return this.bundlePoint(lowestCostBundle,params)
        }

        expenditure(utility:UtilityConstraint) {
            var lowestCostBundle = this.lowestCostBundle(utility);
            return utility.px*lowestCostBundle.x + utility.py*lowestCostBundle.y
        }

        formula(values) {
            return ''; // overridden by subclass
        }



    }
}

