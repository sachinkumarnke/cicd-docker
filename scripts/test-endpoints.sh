#!/bin/bash

# Comprehensive API Testing Script for CI/CD Docker App
# Tests all endpoints with various scenarios

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
TIMEOUT=10

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local expected_status="$3"
    local description="$4"
    local data="${5:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="${BASE_URL}${endpoint}"
    local curl_cmd="curl -s -w '%{http_code}' --max-time ${TIMEOUT}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json' -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    local response
    local status_code
    
    if response=$(eval $curl_cmd 2>/dev/null); then
        status_code="${response: -3}"
        response="${response%???}"
        
        if [ "$status_code" = "$expected_status" ]; then
            log_success "$description (Status: $status_code)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            log_error "$description (Expected: $expected_status, Got: $status_code)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        log_error "$description (Connection failed)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_json_response() {
    local method="$1"
    local endpoint="$2"
    local description="$3"
    local expected_field="$4"
    local data="${5:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="${BASE_URL}${endpoint}"
    local curl_cmd="curl -s --max-time ${TIMEOUT}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json' -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    local response
    
    if response=$(eval $curl_cmd 2>/dev/null); then
        if echo "$response" | grep -q "$expected_field"; then
            log_success "$description (Contains: $expected_field)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            log_error "$description (Missing: $expected_field)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        log_error "$description (Connection failed)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_html_response() {
    local method="$1"
    local endpoint="$2"
    local description="$3"
    local expected_content="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="${BASE_URL}${endpoint}"
    local curl_cmd="curl -s --max-time ${TIMEOUT} '$url'"
    
    local response
    
    if response=$(eval $curl_cmd 2>/dev/null); then
        if echo "$response" | grep -q "$expected_content"; then
            log_success "$description (Contains: $expected_content)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            log_error "$description (Missing: $expected_content)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        log_error "$description (Connection failed)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

run_basic_tests() {
    log_info "Running basic endpoint tests..."
    
    # Test main endpoint (now returns HTML)
    test_endpoint "GET" "/" "200" "Main endpoint returns 200"
    test_html_response "GET" "/" "Main endpoint returns web dashboard" "Professional DevOps Dashboard"
    
    # Test health endpoint
    test_endpoint "GET" "/health" "200" "Health endpoint returns 200"
    test_json_response "GET" "/health" "Health endpoint returns healthy status" '"status":"healthy"'
    
    # Test API documentation
    test_endpoint "GET" "/api" "200" "API documentation endpoint returns 200"
    test_json_response "GET" "/api" "API docs contain endpoint info" '"name":"CI/CD Docker API"'
    
    # Test 404 handling
    test_endpoint "GET" "/nonexistent" "404" "Non-existent endpoint returns 404"
}

run_user_api_tests() {
    log_info "Running user API tests..."
    
    # Test get all users
    test_endpoint "GET" "/api/users" "200" "Get all users returns 200"
    test_json_response "GET" "/api/users" "Users endpoint returns success" '"success":true'
    
    # Test get user by ID
    test_endpoint "GET" "/api/users/1" "200" "Get user by ID returns 200"
    test_json_response "GET" "/api/users/1" "Get user by ID returns user data" '"id":1'
    
    # Test get non-existent user
    test_endpoint "GET" "/api/users/999" "404" "Get non-existent user returns 404"
    
    # Test query parameters
    test_endpoint "GET" "/api/users?role=admin" "200" "Filter users by role returns 200"
    test_endpoint "GET" "/api/users?limit=1" "200" "Limit users returns 200"
}

run_user_creation_tests() {
    log_info "Running user creation tests..."
    
    # Test valid user creation
    local valid_user='{"name":"Test User","email":"test@example.com","role":"user"}'
    test_endpoint "POST" "/api/users" "201" "Create valid user returns 201" "$valid_user"
    
    # Test invalid user creation (missing email)
    local invalid_user='{"name":"Test User"}'
    test_endpoint "POST" "/api/users" "400" "Create user without email returns 400" "$invalid_user"
    
    # Test duplicate email
    local duplicate_user='{"name":"Duplicate User","email":"john@example.com"}'
    test_endpoint "POST" "/api/users" "409" "Create user with duplicate email returns 409" "$duplicate_user"
}

run_performance_tests() {
    log_info "Running basic performance tests..."
    
    local start_time
    local end_time
    local duration
    
    # Test response time for health endpoint
    start_time=$(date +%s%N)
    if curl -s --max-time 5 "${BASE_URL}/health" > /dev/null 2>&1; then
        end_time=$(date +%s%N)
        duration=$(( (end_time - start_time) / 1000000 ))
        
        if [ $duration -lt 1000 ]; then
            log_success "Health endpoint response time: ${duration}ms (< 1000ms)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_warning "Health endpoint response time: ${duration}ms (>= 1000ms)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        log_error "Health endpoint performance test failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
}

run_web_interface_tests() {
    log_info "Running web interface tests..."
    
    # Test web dashboard components
    test_html_response "GET" "/" "Web dashboard has title" "<title>CI/CD Docker App - Professional DevOps Dashboard</title>"
    test_html_response "GET" "/" "Web dashboard has Bootstrap CSS" "bootstrap@5.3.0/dist/css/bootstrap.min.css"
    test_html_response "GET" "/" "Web dashboard has FontAwesome icons" "font-awesome"
    test_html_response "GET" "/" "Web dashboard has health section" "System Health"
    test_html_response "GET" "/" "Web dashboard has user management" "User Management"
    test_html_response "GET" "/" "Web dashboard has API endpoints section" "API Endpoints"
}

show_summary() {
    echo ""
    echo "=========================================="
    echo "           TEST SUMMARY"
    echo "=========================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}All tests passed! ✅${NC}"
        return 0
    else
        echo -e "${RED}Some tests failed! ❌${NC}"
        return 1
    fi
}

main() {
    echo "=========================================="
    echo "    CI/CD Docker App - API Testing"
    echo "=========================================="
    echo "Base URL: $BASE_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo ""
    
    # Check if application is reachable
    if ! curl -s --max-time 5 "${BASE_URL}/health" > /dev/null 2>&1; then
        log_error "Application is not reachable at $BASE_URL"
        log_info "Make sure the application is running and accessible"
        exit 1
    fi
    
    log_success "Application is reachable"
    echo ""
    
    # Run test suites
    run_basic_tests
    echo ""
    run_user_api_tests
    echo ""
    run_user_creation_tests
    echo ""
    run_web_interface_tests
    echo ""
    run_performance_tests
    
    # Show summary and exit with appropriate code
    if show_summary; then
        exit 0
    else
        exit 1
    fi
}

# Handle script interruption
trap 'log_warning "Testing interrupted"; exit 1' INT TERM

# Run main function
main "$@"
