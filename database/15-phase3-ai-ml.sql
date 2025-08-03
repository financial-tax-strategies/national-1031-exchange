-- ============================================
-- Phase 3: AI/ML and Predictive Analytics Tables
-- Deploy when implementing AI features (Months 13-16)
-- ============================================

-- AI model registry and versioning
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Model Identification
    model_name TEXT NOT NULL,
    model_code TEXT UNIQUE NOT NULL,
    model_type TEXT NOT NULL CHECK (model_type IN (
        'prediction',
        'classification',
        'recommendation',
        'nlp',
        'anomaly_detection',
        'clustering'
    )),
    model_version TEXT NOT NULL,
    
    -- Model Purpose
    business_purpose TEXT NOT NULL,
    target_metric TEXT,
    
    -- Model Details
    algorithm TEXT NOT NULL,
    framework TEXT, -- tensorflow, pytorch, scikit-learn
    model_size_mb DECIMAL(10,2),
    
    -- Training Information
    training_data_description TEXT,
    training_dataset_size INTEGER,
    training_duration_hours DECIMAL(10,2),
    feature_columns JSONB NOT NULL,
    target_column TEXT,
    hyperparameters JSONB,
    
    -- Performance Metrics
    accuracy_score DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    auc_score DECIMAL(5,4),
    rmse DECIMAL(10,4),
    custom_metrics JSONB,
    
    -- Validation Metrics
    validation_score DECIMAL(5,4),
    test_score DECIMAL(5,4),
    cross_validation_scores JSONB,
    
    -- Deployment Information
    deployment_status TEXT DEFAULT 'development' CHECK (deployment_status IN (
        'development',
        'testing',
        'staging',
        'production',
        'deprecated',
        'retired'
    )),
    model_endpoint TEXT,
    api_version TEXT,
    
    -- Resource Requirements
    min_memory_gb INTEGER,
    min_cpu_cores INTEGER,
    requires_gpu BOOLEAN DEFAULT FALSE,
    
    -- Monitoring
    prediction_count INTEGER DEFAULT 0,
    last_prediction_at TIMESTAMPTZ,
    average_latency_ms DECIMAL(10,2),
    error_rate DECIMAL(5,2),
    
    -- Documentation
    documentation_url TEXT,
    changelog TEXT,
    known_limitations TEXT,
    
    -- Timestamps
    trained_at TIMESTAMPTZ NOT NULL,
    validated_at TIMESTAMPTZ,
    deployed_at TIMESTAMPTZ,
    retired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Unique constraint on name and version
    UNIQUE(model_name, model_version)
);

-- AI predictions and recommendations
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    
    -- Prediction Target
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'lead',
        'property',
        'market',
        'partner',
        'customer'
    )),
    entity_id UUID NOT NULL,
    
    -- Prediction Details
    prediction_type TEXT NOT NULL CHECK (prediction_type IN (
        'lead_score',
        'conversion_probability',
        'churn_risk',
        'property_value',
        'market_trend',
        'best_action',
        'anomaly_score'
    )),
    prediction_value JSONB NOT NULL,
    prediction_label TEXT,
    confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Probability Distribution (for classification)
    probability_distribution JSONB,
    
    -- Input Features Used
    input_features JSONB NOT NULL,
    feature_importance JSONB,
    
    -- Explanation
    explanation_type TEXT CHECK (explanation_type IN ('shap', 'lime', 'rule_based', 'none')),
    explanation_data JSONB,
    explanation_text TEXT,
    
    -- Recommendations
    recommended_actions JSONB,
    urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Feedback and Outcomes
    actual_outcome JSONB,
    outcome_timestamp TIMESTAMPTZ,
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    feedback_text TEXT,
    prediction_accuracy DECIMAL(5,4),
    
    -- A/B Testing
    experiment_id TEXT,
    variant_name TEXT,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'invalidated')),
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    predicted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    feedback_at TIMESTAMPTZ,
    
    -- Prevent duplicate predictions
    UNIQUE(model_id, entity_type, entity_id, prediction_type, predicted_at)
);

-- AI training datasets
CREATE TABLE IF NOT EXISTS ai_training_datasets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Dataset Information
    dataset_name TEXT NOT NULL,
    dataset_version TEXT NOT NULL,
    dataset_type TEXT CHECK (dataset_type IN ('training', 'validation', 'test')),
    
    -- Data Details
    row_count INTEGER NOT NULL,
    column_count INTEGER NOT NULL,
    feature_columns TEXT[],
    target_column TEXT,
    
    -- Storage
    storage_location TEXT NOT NULL,
    file_format TEXT CHECK (file_format IN ('csv', 'parquet', 'json', 'avro')),
    file_size_mb DECIMAL(10,2),
    compression_type TEXT,
    
    -- Data Quality
    missing_value_count INTEGER,
    duplicate_row_count INTEGER,
    quality_score DECIMAL(5,2),
    quality_issues JSONB,
    
    -- Usage Tracking
    used_by_models UUID[],
    last_used_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    
    UNIQUE(dataset_name, dataset_version)
);

-- Model performance tracking
CREATE TABLE IF NOT EXISTS ai_model_performance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    
    -- Time Period
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    period_type TEXT CHECK (period_type IN ('hour', 'day', 'week', 'month')),
    
    -- Volume Metrics
    prediction_count INTEGER NOT NULL,
    unique_entities INTEGER,
    
    -- Performance Metrics
    average_confidence DECIMAL(5,4),
    accuracy_rate DECIMAL(5,4),
    precision_rate DECIMAL(5,4),
    recall_rate DECIMAL(5,4),
    
    -- Latency Metrics
    avg_latency_ms DECIMAL(10,2),
    p50_latency_ms DECIMAL(10,2),
    p95_latency_ms DECIMAL(10,2),
    p99_latency_ms DECIMAL(10,2),
    
    -- Error Metrics
    error_count INTEGER DEFAULT 0,
    error_rate DECIMAL(5,4),
    timeout_count INTEGER DEFAULT 0,
    
    -- Business Impact
    correct_predictions INTEGER,
    incorrect_predictions INTEGER,
    business_value_generated DECIMAL(12,2),
    
    -- Resource Usage
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_gb DECIMAL(10,2),
    gpu_usage_percent DECIMAL(5,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(model_id, period_start, period_type)
);

-- Feature store for ML pipelines
CREATE TABLE IF NOT EXISTS ai_feature_store (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Feature Identification
    feature_name TEXT UNIQUE NOT NULL,
    feature_group TEXT NOT NULL,
    feature_version INTEGER DEFAULT 1,
    
    -- Feature Details
    description TEXT,
    data_type TEXT NOT NULL,
    feature_type TEXT CHECK (feature_type IN ('numeric', 'categorical', 'text', 'embedding', 'datetime')),
    
    -- Computation
    computation_query TEXT,
    computation_schedule TEXT, -- cron expression
    last_computed_at TIMESTAMPTZ,
    
    -- Statistics
    null_percentage DECIMAL(5,2),
    unique_values INTEGER,
    mean_value DECIMAL,
    std_deviation DECIMAL,
    min_value DECIMAL,
    max_value DECIMAL,
    
    -- Usage
    used_by_models TEXT[],
    importance_scores JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    deprecation_date DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_ai_models_status ON ai_models(deployment_status);
CREATE INDEX idx_ai_models_type ON ai_models(model_type);
CREATE INDEX idx_ai_predictions_model ON ai_predictions(model_id);
CREATE INDEX idx_ai_predictions_entity ON ai_predictions(entity_type, entity_id);
CREATE INDEX idx_ai_predictions_type ON ai_predictions(prediction_type);
CREATE INDEX idx_ai_predictions_created ON ai_predictions(predicted_at);
CREATE INDEX idx_ai_predictions_confidence ON ai_predictions(confidence_score);
CREATE INDEX idx_ai_performance_model ON ai_model_performance(model_id);
CREATE INDEX idx_ai_performance_period ON ai_model_performance(period_start, period_type);
CREATE INDEX idx_ai_feature_group ON ai_feature_store(feature_group);
CREATE INDEX idx_ai_feature_active ON ai_feature_store(is_active);

-- Create triggers
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_feature_store_updated_at BEFORE UPDATE ON ai_feature_store
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Automated model monitoring
CREATE OR REPLACE FUNCTION track_model_prediction() RETURNS TRIGGER AS $$
BEGIN
    -- Update model prediction count and last prediction time
    UPDATE ai_models 
    SET prediction_count = prediction_count + 1,
        last_prediction_at = NEW.predicted_at
    WHERE id = NEW.model_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_predictions AFTER INSERT ON ai_predictions
    FOR EACH ROW EXECUTE FUNCTION track_model_prediction();

-- RLS Policies
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_store ENABLE ROW LEVEL SECURITY;

-- Only admins can manage AI models
CREATE POLICY "Admins manage AI models" ON ai_models
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
            AND role IN ('admin', 'super_admin')
        )
    );

-- Users can see their own predictions
CREATE POLICY "Users view own predictions" ON ai_predictions
    FOR SELECT TO authenticated
    USING (
        (entity_type = 'lead' AND entity_id IN (
            SELECT id FROM leads WHERE email = auth.jwt() ->> 'email'
        ))
        OR EXISTS (
            SELECT 1 FROM admin_users
            WHERE email = auth.jwt() ->> 'email'
        )
    );